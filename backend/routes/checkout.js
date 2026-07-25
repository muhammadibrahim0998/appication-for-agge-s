import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Customer from '../models/Customer.js';
import crypto from 'crypto';


const router = express.Router();
// Initialize stripe with dummy key if not present in env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// Middleware to verify customer
const authenticateCustomer = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  const customerId = authHeader.split(' ')[1];
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(401).json({ message: 'Invalid session' });
    req.customer = customer;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid session' });
  }
};

// Checkout endpoint
router.post('/', authenticateCustomer, async (req, res) => {
  try {
    const { paymentMethod, shippingDetails } = req.body;
    const customer = req.customer;

    if (!customer.cart || customer.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = customer.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shopId = customer.shopId;

    // Create Order
    const order = new Order({
      shopId,
      customerId: customer._id,
      items: customer.cart,
      totalAmount,
      shippingDetails,
      paymentMethod,
      paymentStatus: 'PENDING'
    });
    
    await order.save();

    if (paymentMethod === 'COD') {
      // For Cash on Delivery, just confirm the order and clear the cart
      customer.cart = [];
      await customer.save();
      return res.json({ success: true, message: 'Order placed successfully (COD)', orderId: order._id });
    } 
    else if (paymentMethod === 'STRIPE') {
      // Create Stripe Checkout Session
      const line_items = customer.cart.map(item => ({
        price_data: {
          currency: 'usd', // Defaulting to USD for Stripe
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      }));

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${frontendUrl}/store?payment=success&orderId=${order._id}`,
        cancel_url: `${frontendUrl}/store?payment=cancel`,
        metadata: {
          orderId: order._id.toString()
        }
      });

      return res.json({ success: true, sessionId: session.id, url: session.url });
    }
    else if (paymentMethod === 'EASYPAISA') {
      const superAdminNumber = process.env.SUPERADMIN_EASYPAISA_NUMBER || '03098216202';
      
      const easyPaisaData = {
        superAdminNumber,
        accountTitle: 'Super Admin',
        orderId: order._id.toString(),
        transactionAmount: totalAmount,
      };

      return res.json({ success: true, easyPaisaData, message: 'EasyPaisa Account Details' });
    }
    else {
      return res.status(400).json({ message: 'Invalid Payment Method' });
    }

  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to mark order as paid / submit payment proof
router.post('/confirm/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.paymentStatus = 'PAID';
    if (req.body.transactionId) {
      order.transactionId = req.body.transactionId;
    }
    if (req.body.paymentProof) {
      order.paymentProof = req.body.paymentProof;
    }
    await order.save();

    // Clear customer cart
    const customer = await Customer.findById(order.customerId);
    if (customer) {
      customer.cart = [];
      await customer.save();
    }

    res.json({ success: true, order });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to fetch all orders for SuperAdmin / Admin inspection
router.get('/orders', async (req, res) => {
  try {
    const { shopId, paymentMethod, paymentStatus } = req.query;
    const query = {};
    if (shopId) query.shopId = shopId;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('shopId', 'name address')
      .populate('customerId', 'fullName email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to update payment status or order status
router.patch('/order/:orderId/status', async (req, res) => {
  try {
    const { paymentStatus, orderStatus } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;

    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to delete payment proof screenshot of an order
router.delete('/order/:orderId/proof', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.paymentProof = undefined;
    await order.save();
    res.json({ success: true, message: 'Payment screenshot proof deleted successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint to delete an order completely
router.delete('/order/:orderId', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

