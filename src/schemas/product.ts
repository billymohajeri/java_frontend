import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number"
    })
    .min(0.01, "Price must be greater than 0"),

  color: z.string().min(1, "Color cannot be empty"),

  rating: z
    .number({
      invalid_type_error: "Rating must be a number"
    })
    .min(0, "Rating must be at least 0")
    .max(5, "Rating must be at most 5")
    .optional(),

  stock: z
    .number({
      required_error: "Stock is required",
      invalid_type_error: "Stock must be an integer"
    })
    .int("Stock must be an integer")
    .min(0, "Stock must be at least 0"),

  images: z.array(z.string().url("Invalid URL").optional())
})
