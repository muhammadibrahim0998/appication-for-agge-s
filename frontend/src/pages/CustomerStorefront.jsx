import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingBag, MapPin, Phone, Package,
  ChevronDown, X, Egg, ArrowLeft, ShoppingCart,
  Plus, Minus, Trash2, User, Lock, Mail, LogOut, Eye, EyeOff,
  CheckCircle, AlertCircle, Sparkles, UserCircle2, Store,
  Layers, ShoppingBasket, Shirt, Home, Watch, Smartphone, Footprints,
  Menu, Filter, HelpCircle, LayoutDashboard
} from 'lucide-react';
import { CustomerAuthProvider, useCustomerAuth } from '../contexts/CustomerAuthContext.jsx';

const API_CATALOG = '/api/catalog';

// Helper to get category-specific icon
const getCategoryIcon = (category) => {
  const cat = category.toLowerCase();
  if (cat.includes('grocery')) return ShoppingBasket;
  if (cat.includes('apparel') || cat.includes('cloth')) return Shirt;
  if (cat.includes('home') || cat.includes('decor')) return Home;
  if (cat.includes('accessories')) return Watch;
  if (cat.includes('electronic') || cat.includes('tech')) return Smartphone;
  if (cat.includes('footwear') || cat.includes('shoe')) return Footprints;
  if (cat.includes('package') || cat.includes('acc')) return Package;
  return Layers;
};

// ─── Customer Register / Login Full Page Component ───────────────────────────
function CustomerAuthView({ shopInfo }) {
  const navigate = useNavigate();
  const { register, login } = useCustomerAuth();
  const [mode, setMode] = useState('register');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState('');

  const handle = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      if (mode === 'register') {
        await register(form);
        await login({ email: form.email, password: form.password });
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-emerald-500/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#2D5A27]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 animate-in zoom-in-95 duration-500">
        <button
          onClick={() => navigate('/shop')}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-widest bg-emerald-950/60 px-4 py-2 rounded-full border border-emerald-800/40 backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store Selector
        </button>

        <div className="bg-[#1E293B] border border-slate-700/60 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2D5A27] via-emerald-500 to-[#1B3817]" />

          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="p-4 bg-white rounded-2xl shadow-inner">
                {shopInfo?.logoUrl ? (
                  <img src={shopInfo.logoUrl} alt={shopInfo.name} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <img src="https://img.icons8.com/emoji/96/egg-emoji.png" alt="Egg Logo" className="w-12 h-12 object-contain drop-shadow-md" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">{shopInfo?.name || 'Customer Portal'}</h1>
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5">
              Customer Store Login / Register
            </p>
          </div>

          <div className="flex bg-slate-900/80 rounded-2xl p-1.5 mb-6 border border-slate-700/50">
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                mode === 'register' ? 'bg-[#1B3817] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Register
            </button>
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                mode === 'login' ? 'bg-[#1B3817] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Sign In
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              {success}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handle('fullName')}
                    required
                    className="w-full bg-slate-900/60 border border-slate-700/60 focus:border-emerald-500 rounded-2xl py-3.5 pl-11 pr-4 text-white text-xs font-bold placeholder:text-slate-500 outline-none transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={form.email}
                  onChange={handle('email')}
                  required
                  className="w-full bg-slate-900/60 border border-slate-700/60 focus:border-emerald-500 rounded-2xl py-3.5 pl-11 pr-4 text-white text-xs font-bold placeholder:text-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handle('password')}
                  required
                  className="w-full bg-slate-900/60 border border-slate-700/60 focus:border-emerald-500 rounded-2xl py-3.5 pl-11 pr-12 text-white text-xs font-bold placeholder:text-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1B3817] hover:bg-[#12290D] border-t border-t-white/20 border-b-4 border-b-[#12290D] disabled:opacity-50 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:translate-y-[2px] mt-4"
            >
              {loading ? (
                mode === 'register' ? 'Registering...' : 'Signing In...'
              ) : (
                mode === 'register' ? 'Register Account & Continue' : 'Sign In to Store'
              )}
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t border-slate-700/50">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {mode === 'register' ? 'Already registered?' : "Need an account?"}
              <button
                type="button"
                onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}
                className="text-emerald-400 hover:text-emerald-300 underline font-black ml-1.5"
              >
                {mode === 'register' ? 'Sign In Here' : 'Create Account Here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Drawer Component ───────────────────────────────────────────────────
function CartDrawer({ currency }) {
  const { cart, cartOpen, setCartOpen, cartTotal, updateCartItem, removeFromCart, clearCart } = useCustomerAuth();

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end" onClick={() => setCartOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" />
      <div 
        className="relative w-full max-w-md bg-[#1E293B] border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-white"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700/60 bg-[#15202B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1B3817] rounded-xl border border-white/10">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Your Cart</h2>
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{cart.length} item{cart.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {cart.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="p-5 bg-slate-900 rounded-full border border-slate-700 mb-3">
                <ShoppingCart className="w-10 h-10 text-slate-600" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Your cart is currently empty</p>
            </div>
          ) : cart.map(item => (
            <div key={item.itemId} className="flex items-center gap-4 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 shadow-sm">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Egg className="w-6 h-6 text-slate-600" /></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-xs truncate uppercase tracking-tight">{item.name}</p>
                <p className="text-emerald-400 font-black text-sm mt-0.5">{currency} {item.price.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button onClick={() => updateCartItem(item.itemId, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                  <Minus className="w-3 h-3 text-white" />
                </button>
                <span className="text-white font-black text-xs w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateCartItem(item.itemId, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-[#1B3817] text-white rounded-lg transition-all">
                  <Plus className="w-3 h-3 text-white" />
                </button>
                <button onClick={() => removeFromCart(item.itemId)}
                  className="w-7 h-7 flex items-center justify-center bg-rose-500/10 hover:bg-rose-500/20 rounded-lg transition-all ml-1">
                  <Trash2 className="w-3 h-3 text-rose-400" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-700/60 bg-[#15202B] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Amount</span>
              <span className="text-2xl font-black text-emerald-400">{currency} {cartTotal.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
              <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
                Contact store to complete your order
              </p>
            </div>
            <button onClick={clearCart}
              className="w-full py-3 bg-white/5 hover:bg-rose-500/10 border border-white/10 text-slate-400 hover:text-rose-400 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              Empty Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Storefront Content (Dashboard with Green Sidebar & Gray/Green Theme) ─────────
function StoreContent({ shopId }) {
  const navigate = useNavigate();
  const { customer, logout, cartCount, setCartOpen, addToCart } = useCustomerAuth();
  const [shop, setShop] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [addedMsg, setAddedMsg] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeCategory !== 'All') params.set('category', activeCategory);
      const res = await fetch(`${API_CATALOG}/${shopId}?${params}`);
      const data = await res.json();
      if (res.ok) {
        setShop(data.shop);
        setItems(data.items);
        setCategories(data.categories);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchCatalog(); }, [shopId, search, activeCategory]);

  if (!customer) {
    return <CustomerAuthView shopInfo={shop} />;
  }

  const currency = shop?.currency || 'Rs.';

  const handleAddToCart = async (item) => {
    try {
      await addToCart(item, 1);
      setAddedMsg(`"${item.name}" added to cart!`);
      setTimeout(() => setAddedMsg(''), 2500);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0f172a] text-white w-full tracking-tight">
      {/* Cart Drawer */}
      <CartDrawer currency={currency} />

      {/* Notification Toast */}
      {addedMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] bg-[#1B3817] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-2xl border border-white/20 flex items-center gap-2.5 animate-in slide-in-from-top duration-300 uppercase tracking-wider">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {addedMsg}
        </div>
      )}

      {/* Top Navbar — Gray/Green Theme matching main App Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-[#2D5A27]/90 backdrop-blur-md border-b border-green-800/50 shadow-md transition-all duration-300">
        <div className="flex items-center justify-between h-20 gap-4 px-4 sm:px-6 max-w-[1600px] mx-auto">
          
          {/* Left branding */}
          <div className="flex items-center gap-4">
            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2.5 -ml-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all shadow-md border border-white/10 md:hidden"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Toggle */}
            <button
              onClick={() => setIsDesktopOpen(!isDesktopOpen)}
              className="p-2.5 -ml-2 text-white/90 hover:text-white hover:bg-white/15 rounded-full transition-all shadow-md border border-white/10 hidden md:block"
              aria-label="Toggle Desktop Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button onClick={() => navigate('/shop')} className="p-2 -ml-2 text-white/80 hover:text-white transition-colors hidden md:block" title="Back to Stores">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setActiveCategory('All');
                  const mainContent = document.getElementById('main-store-content');
                  if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="relative bg-white rounded-full w-12 h-12 flex items-center justify-center shrink-0 shadow-[0_8px_15px_rgba(0,0,0,0.4)] overflow-hidden border-2 border-white/40 ring-2 ring-black/20 hover:scale-105 transition-transform"
                title="Go to Products"
              >
                {shop?.logoUrl ? (
                  <img src={shop.logoUrl} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                  <img src="https://img.icons8.com/emoji/96/egg-emoji.png" alt="Egg Logo" className="w-8 h-8 object-contain drop-shadow-md" />
                )}
              </button>
              <div>
                <h1 className="text-xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] leading-none">{shop?.name || 'Customer Store'}</h1>
                {shop?.address && (
                  <p className="text-[10px] font-bold text-emerald-300 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3" />{shop.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 flex justify-center max-w-md mx-auto hidden sm:flex">
            <div className="relative w-full">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                placeholder="Search products..."
                className="w-full bg-white/90 backdrop-blur-sm rounded-full py-3 flex items-center pl-6 pr-14 text-sm font-black text-gray-800 placeholder:text-gray-400 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),_0_10px_20px_rgba(0,0,0,0.25)] border-b-4 border-gray-300"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#1B3817] text-white p-2 rounded-full shadow-md">
                <Search className="w-4 h-4" />
              </button>

              {/* Desktop Search Dropdown */}
              {search.trim() && showSearchDropdown && (
                <div className="absolute top-full mt-2 w-full bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {items.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto py-2 scrollbar-hide">
                      {items.map(item => (
                        <button
                          key={item._id}
                          onClick={() => { setSelectedItem(item); setSearch(''); setShowSearchDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-left border-b border-slate-700/50 last:border-0"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                            {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <Egg className="w-6 h-6 m-2 text-slate-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white text-xs truncate uppercase tracking-tight">{item.name}</p>
                            <p className="text-emerald-400 font-black text-[10px]">{currency} {item.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Cart & User Badges */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-3 bg-[#1B3817] hover:bg-[#0C1D08] text-white rounded-full transition-all border-t border-white/20 border-b-4 shadow-[0_8px_15px_rgba(0,0,0,0.3)] hover:scale-105 active:translate-y-[2px]"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[10px] font-black h-5.5 w-5.5 rounded-full flex items-center justify-center border-2 border-[#1B3817] shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Area with Left Sidebar & Content */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* ─── Green Gradient Sidebar matching main app ─────────────────────── */}
        <aside
          className={`absolute md:relative top-0 h-full flex flex-col bg-gradient-to-b from-[#2D5A27] via-[#24491F] to-[#1B3817] text-white backdrop-blur-xl transition-all duration-300 ease-in-out border-r border-white/10 z-[100] md:z-20 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.3)] w-56 ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } ${
            !isDesktopOpen ? 'md:-ml-56' : 'md:ml-0'
          }`}
        >
          {/* Customer Profile Box */}
          <div className="mx-4 mb-6 mt-4 rounded-2xl flex items-center px-4 py-3 gap-3 border border-white/10 bg-white/5 backdrop-blur-sm shadow-inner">
            <div className="relative flex-shrink-0">
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#111827] rounded-full shadow-sm" />
              <UserCircle2 className="w-8 h-8 text-green-300" />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
              <span className="text-sm font-bold text-white truncate">{customer.fullName}</span>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Customer</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2 space-y-6">
            
            {/* Products Section */}
            <div>
              <p className="px-8 text-[11px] font-bold text-white/30 mb-3 tracking-wider uppercase">Catalog</p>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveCategory('All'); setIsMobileOpen(false); }}
                  className={`w-full flex items-center gap-4 group px-3 py-3 mx-4 rounded-2xl text-[13px] font-bold transition-all duration-300 max-w-[192px] ${
                    activeCategory === 'All'
                      ? "bg-[#1B3817] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] shadow-[0_8px_15px_rgba(0,0,0,0.3)]"
                      : "text-white/60 hover:text-white hover:bg-[#1B3817] border-t border-t-transparent hover:border-t-white/20 border-b-4 border-b-transparent hover:border-b-[#12290D]"
                  }`}
                >
                  <Store className="w-5 h-5 text-white" />
                  <span>All Products</span>
                </button>
              </div>
            </div>

            {/* Categories */}
            {categories.filter(c => c !== 'All').length > 0 && (
              <div>
                <p className="px-8 text-[11px] font-bold text-white/30 mb-3 tracking-wider uppercase">Categories</p>
                <div className="space-y-1">
                  {categories.filter(c => c !== 'All').map(cat => {
                    const active = activeCategory === cat;
                    const CategoryIcon = getCategoryIcon(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setIsMobileOpen(false); }}
                        className={`w-full flex items-center gap-4 group px-3 py-2.5 mx-4 rounded-xl text-[13px] font-bold transition-all duration-300 max-w-[192px] ${
                          active
                            ? "bg-[#1B3817] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] shadow-[0_8px_15px_rgba(0,0,0,0.3)]"
                            : "text-white/60 hover:text-white hover:bg-[#1B3817] border-t border-t-transparent hover:border-t-white/20 border-b-4 border-b-transparent hover:border-b-[#12290D]"
                        }`}
                      >
                        <CategoryIcon className="w-4 h-4 text-white" />
                        <span className="capitalize truncate">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cart Quick Access */}
            <div>
              <p className="px-8 text-[11px] font-bold text-white/30 mb-3 tracking-wider uppercase">Cart</p>
              <div className="space-y-1">
                <button
                  onClick={() => { setCartOpen(true); setIsMobileOpen(false); }}
                  className="w-full flex items-center gap-4 group px-3 py-3 mx-4 rounded-2xl text-[13px] font-bold text-white/60 hover:text-white hover:bg-[#1B3817] border-t border-t-transparent hover:border-t-white/20 border-b-4 border-b-transparent hover:border-b-[#12290D] max-w-[192px]"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                  <span>My Cart ({cartCount})</span>
                </button>
              </div>
            </div>

            {/* Logout Footer */}
            <div className="pb-6 pt-4 border-t border-white/10 mx-4">
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-[13px] font-bold text-rose-300 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/20 transition-all"
              >
                <LogOut className="w-5 h-5 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>

          </div>
        </aside>

        {/* ─── Main Content Pane with Gray Background & Green Accents ──────── */}
        <div className="flex-1 w-full flex flex-col overflow-hidden relative bg-[#0f172a]">
          <main id="main-store-content" className="flex-1 w-full overflow-y-auto p-3 sm:p-4 lg:p-6 bg-[#0f172a] text-white scroll-smooth">
            <div className="max-w-7xl mx-auto space-y-3">

              {/* Compact Banner with Text */}
              <div className="relative bg-gradient-to-r from-[#1E293B] via-[#1B3817] to-[#0f172a] border border-slate-700/60 rounded-xl sm:rounded-2xl px-4 py-3 sm:px-5 sm:py-4 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] pointer-events-none">
                  <ShoppingBag className="w-24 h-24 sm:w-32 sm:h-32 text-emerald-400" />
                </div>
                
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[9px] font-black uppercase tracking-widest shrink-0">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> Welcome, {customer.fullName}
                    </span>
                  </div>
                  <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight uppercase italic truncate">
                    Fresh Inventory & Products Catalog
                  </h1>
                  <p className="text-[10px] sm:text-xs text-slate-400 max-w-xl font-medium line-clamp-1 sm:line-clamp-none">
                    Browse products, check stock levels, and add items to your cart easily.
                  </p>
                </div>
              </div>

              {/* Mobile Search Bar */}
              <div className="relative w-full sm:hidden z-30">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-10 pr-4 text-xs font-bold text-white outline-none focus:border-emerald-500 transition-colors shadow-inner"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                
                {/* Mobile Search Dropdown */}
                {search.trim() && showSearchDropdown && (
                  <div className="absolute top-full mt-2 w-full bg-[#1E293B] border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {items.length > 0 ? (
                      <div className="max-h-60 overflow-y-auto py-2 scrollbar-hide">
                        {items.map(item => (
                          <button
                            key={item._id}
                            onClick={() => { setSelectedItem(item); setSearch(''); setShowSearchDropdown(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800 transition-colors text-left border-b border-slate-700/50 last:border-0"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                              {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <Egg className="w-5 h-5 m-1.5 text-slate-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-white text-[11px] truncate uppercase tracking-tight">{item.name}</p>
                              <p className="text-emerald-400 font-black text-[9px]">{currency} {item.price}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Category Pills (Mobile/Quick Filter) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest pr-2 border-r border-slate-700">
                  <Filter className="w-3.5 h-3.5" /> Filter
                </div>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      activeCategory === cat
                        ? 'bg-[#1B3817] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products Cards Grid */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Catalog...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-20 bg-slate-800/40 border border-slate-700/60 rounded-3xl flex flex-col items-center">
                  <Package className="w-16 h-16 text-slate-600 mb-3" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {items.map(item => (
                    <div
                      key={item._id}
                      className="group bg-[#1E293B] border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex flex-col"
                    >
                      {/* Image Container */}
                      <button onClick={() => setSelectedItem(item)} className="block aspect-square bg-slate-900 overflow-hidden relative">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Egg className="w-12 h-12 text-slate-700" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-[#111827]/90 px-3 py-1 rounded-full text-[9px] font-black text-emerald-400 uppercase tracking-widest border border-slate-700">
                          {item.category}
                        </div>
                      </button>

                      {/* Item Info & Action */}
                      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                        <button onClick={() => setSelectedItem(item)} className="text-left space-y-1">
                          <h3 className="font-black text-white text-sm leading-snug line-clamp-2 uppercase tracking-tight group-hover:text-emerald-300 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-emerald-400 font-black text-lg">{currency} {item.price.toLocaleString()}</p>
                        </button>

                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-[#1B3817] hover:bg-[#12290D] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-md active:translate-y-[2px] active:border-b-0"
                        >
                          <Plus className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </main>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-[#1E293B] border border-slate-700 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 text-white"
            onClick={e => e.stopPropagation()}
          >
            {selectedItem.images?.[0] && (
              <div className="aspect-video overflow-hidden relative">
                <img src={selectedItem.images[0]} alt={selectedItem.name} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2.5 bg-black/60 hover:bg-black rounded-full text-white backdrop-blur-md transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{selectedItem.category}</span>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">{selectedItem.name}</h2>
              </div>

              {selectedItem.description && (
                <p className="text-slate-300 text-xs leading-relaxed font-medium">{selectedItem.description}</p>
              )}

              <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-700 rounded-2xl">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Price per unit</p>
                  <p className="text-2xl font-black text-emerald-400">{currency} {selectedItem.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">In Stock</p>
                  <p className="text-xl font-black text-white">{selectedItem.stock} <span className="text-xs text-slate-400">units</span></p>
                </div>
              </div>

              <button
                onClick={() => { handleAddToCart(selectedItem); setSelectedItem(null); }}
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#1B3817] hover:bg-[#12290D] text-white border-t border-t-white/20 border-b-4 border-b-[#12290D] rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:translate-y-[2px]"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── All Shops Selector List Component ───────────────────────────────────────
function ShopsList() {
  const navigate = useNavigate();
  const [allShops, setAllShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_CATALOG).then(r => r.json()).then(d => { setAllShops(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-500/30 relative overflow-hidden">
      <div className="max-w-4xl w-full z-10 py-12">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex p-5 bg-white rounded-[2rem] mb-2 shadow-2xl">
            <img src="https://img.icons8.com/emoji/96/egg-emoji.png" alt="Egg Network" className="w-14 h-14 object-contain drop-shadow-xl" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase italic">
            EGG STATION NETWORK
          </h1>
          <p className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs">
            Select Your Preferred Store
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {allShops.map(s => (
              <button 
                key={s._id} 
                onClick={() => navigate(`/shop/${s._id}`)}
                className="group bg-[#1E293B] hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-[2rem] p-7 text-left transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              >
                <div className="flex items-center gap-5 mb-4">
                  <div className="p-4 bg-white rounded-2xl group-hover:scale-110 transition-transform shadow-md">
                    {s.logoUrl ? (
                      <img src={s.logoUrl} alt={s.name} className="w-10 h-10 object-cover rounded-xl" />
                    ) : (
                      <img src="https://img.icons8.com/emoji/96/egg-emoji.png" alt="Egg Logo" className="w-10 h-10 object-contain drop-shadow-md" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white tracking-tight uppercase italic group-hover:text-emerald-300 transition-colors">{s.name}</h2>
                    {s.address && <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">{s.address}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] pt-4 border-t border-slate-700/60">
                  <span>Enter Customer Portal</span>
                  <ChevronDown className="w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
            {allShops.length === 0 && (
              <div className="col-span-2 text-center text-slate-400 py-20 font-black uppercase tracking-widest text-xs">
                No active stores found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root Export ─────────────────────────────────────────────────────────────
export function CustomerStorefront() {
  const { shopId } = useParams();
  if (!shopId) return <ShopsList />;
  return (
    <CustomerAuthProvider shopId={shopId}>
      <StoreContent shopId={shopId} />
    </CustomerAuthProvider>
  );
}
