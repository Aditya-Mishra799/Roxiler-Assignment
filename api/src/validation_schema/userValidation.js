import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[@$!%*?&#^()\-_=+{}[\]|;:'",.<>]/, {
    message: "Password must contain at least one special character",
  });

export const userSchema = z.object({
  name: z
    .string()
    .min(20, { message: "Name must be at least 20 characters long" })
    .max(60, { message: "Name must not exceed 60 characters" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: passwordSchema,

  role: z.enum(["admin", "owner", "user"], {
    message: "Role must be either admin, owner, or user",
  }),
  address: z
    .string()
    .max(400, { message: "Address must not exceed 400 characters" }),
});
