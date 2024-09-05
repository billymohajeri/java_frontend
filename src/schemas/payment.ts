import { z } from "zod"

export const paymentSchema = z.object({
  amount: z
    .number({
      invalid_type_error: "Amount must be a number"
    })
    .min(0.1, "Amount must be greater than 0"),

  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),

  method: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "CASH"])
})
