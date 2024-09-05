import { z } from "zod"

export const orderSchema = z.object({
  // userId: z
  //   .string()
  //   .uuid("Invalid User ID")
  //   .min(1, "User ID cannot be empty"),

  status: z.string().min(1, "Status cannot be empty"),

  address: z
    .string()
    .min(1, { message: "Address cannot be empty" })
    .max(255, { message: "Address length cannot exceed 255 characters." })
})
