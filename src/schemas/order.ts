import { z } from "zod"

export const orderSchema = z.object({
  userId: z.string().uuid("Invalid User ID")
})
