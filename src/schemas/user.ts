import { parse } from "date-fns"
import { z } from "zod"

const PHONE_REGEX = /^\+\d{5,}$/

export const userSchema = z
  .object({
    firstName: z.string().min(1, "First Name cannot be empty"),

    lastName: z.string().min(1, "Last Name cannot be empty"),

    email: z.string().email("Invalid email address"),

    phoneNumber: z.string().regex(PHONE_REGEX, {
      message: "Phone number must start with a '+' and contain at least 5 digits"
    }),

    birthDate: z.preprocess(
      (arg) => {
        if (typeof arg === "string") {
          const parsedDate = parse(arg, "dd-MM-yyyy", new Date())
          return parsedDate
        }
        return arg
      },
      z.date({
        required_error: "Birth Date is required",
        invalid_type_error: "Invalid date format"
      })
    ),

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
