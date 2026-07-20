import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string(),
});
