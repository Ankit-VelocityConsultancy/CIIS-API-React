import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { invoiceSchema } from "../../schema";

const Validate = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: "",
      billingAddress: "",
      invoiceDate: "",
      dueDate: "",
      lineItems: [{ description: "", quantity: 1, price: 0.01 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const onSubmit = (data) => {
    console.log("Invoice Data:", data);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)();
      }}
    >
      <h1>Invoice Generator</h1>

      <div>
        <label>Customer Name:</label>
        <input {...register("customerName")} />
        {errors.customerName && (
          <p style={{ color: "red" }}>{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <label>Billing Address:</label>
        <textarea {...register("billingAddress")} />
        {errors.billingAddress && (
          <p style={{ color: "red" }}>{errors.billingAddress.message}</p>
        )}
      </div>

      <div>
        <label>Invoice Date:</label>
        <input type="date" {...register("invoiceDate")} />
        {errors.invoiceDate && (
          <p style={{ color: "red" }}>{errors.invoiceDate.message}</p>
        )}
      </div>

      <div>
        <label>Due Date:</label>
        <input type="date" {...register("dueDate")} />
        {errors.dueDate && (
          <p style={{ color: "red" }}>{errors.dueDate.message}</p>
        )}
      </div>

      <h2>Line Items</h2>
      {fields.map((item, index) => (
        <div key={item.id}>
          <input
            placeholder="Description"
            {...register(`lineItems.${index}.description`)}
          />
          {errors.lineItems?.[index]?.description && (
            <p style={{ color: "red" }}>
              {errors.lineItems[index].description?.message}
            </p>
          )}
          <input
            type="number"
            placeholder="Quantity"
            {...register(`lineItems.${index}.quantity`, { valueAsNumber: true })}
          />
          {errors.lineItems?.[index]?.quantity && (
            <p style={{ color: "red" }}>
              {errors.lineItems[index].quantity?.message}
            </p>
          )}
          <input
            type="number"
            step="0.01"
            placeholder="Price"
            {...register(`lineItems.${index}.price`, { valueAsNumber: true })}
          />
          {errors.lineItems?.[index]?.price && (
            <p style={{ color: "red" }}>
              {errors.lineItems[index].price?.message}
            </p>
          )}
          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({ description: "", quantity: 1, price: 0.01 })
        }
      >
        Add Line Item
      </button>

      <button type="submit">Generate Invoice</button>
    </form>
  );
};

export default Validate;
