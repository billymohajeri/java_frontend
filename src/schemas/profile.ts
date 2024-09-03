import { z } from "zod"

export const profileSchema = z.object({
  firstName: z.string()
    .min(1, "First Name cannot be empty")
    .max(50, "First Name cannot exceed 50 characters"),

  lastName: z.string()
    .min(1, "Last Name cannot be empty")
    .max(50, "Last Name cannot exceed 50 characters")
})
