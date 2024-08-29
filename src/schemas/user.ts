import { z } from "zod"

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password cannot be empty")
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number"
      }),
    confirmPassword: z.string().min(1, "Confirm Password cannot be empty")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
