import { parse } from "date-fns"
import { z } from "zod"

const PHONE_REGEX = /^\+\d{5,}$/

export const addUserSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First Name cannot be empty")
      .max(50, "First Name cannot exceed 50 characters"),

    lastName: z
      .string()
      .min(1, "Last Name cannot be empty")
      .max(50, "Last Name cannot exceed 50 characters"),

    email: z.string().email("Invalid email address").min(1, "Email address cannot be empty"),

    role: z.string().min(1, "Role cannot be empty"),

    phoneNumber: z
      .string()
      .regex(PHONE_REGEX, {
        message: "Phone number must start with a '+' and contain at least 5 digits"
      })
      .min(1, "Phone number cannot be empty"),
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

export const editUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name cannot be empty")
    .max(50, "First Name cannot exceed 50 characters"),

  lastName: z
    .string()
    .min(1, "Last Name cannot be empty")
    .max(50, "Last Name cannot exceed 50 characters"),

  email: z.string().email("Invalid email address").min(1, "Email address cannot be empty"),

  role: z.string().min(1, "Role cannot be empty"),

  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, {
      message: "Phone number must start with a '+' and contain at least 5 digits"
    })
    .min(1, "Phone number cannot be empty"),
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
  )
})
