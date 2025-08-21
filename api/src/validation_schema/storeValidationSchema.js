import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" })
    .max(60, { message: "Name must not exceed 60 characters" }),

  email: z.string().email({ message: "Invalid email address" }),
  address: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" })
    .max(400, { message: "Name must not exceed 400 characters" }),
});
