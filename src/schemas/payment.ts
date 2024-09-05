import { z } from "zod"

export const paymentSchema = z.object({
  amount: z.number().min(0.01, { message: "Amount must be greater than 0" }),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]),
  method: z.enum(["CREDIT_CARD", "BANK_TRANSFER", "CASH"])
})
