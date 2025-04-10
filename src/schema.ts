import { z } from "zod";

// define the schema with validation and error messages
export const invoiceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  billingAddress: z.string().min(1, "Billing address is required"),
  invoiceDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0.01, "Price must be at least $0.01"),
      })
    )
    .nonempty("At least one line item is required"),
});

// export the type with Typescript inference
export type InvoiceFormValues = z.infer<typeof invoiceSchema>;