import { pgTable, text, integer, timestamp, uuid, numeric, index } from "drizzle-orm/pg-core";
import { products } from "./products.js";

export const manualSales = pgTable(
  "manual_sales",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    customerName: text("customer_name").notNull(),
    customerContact: text("customer_contact"),
    quantity: integer("quantity").notNull().default(1),
    salePrice: numeric("sale_price", { precision: 12, scale: 2 }).notNull(),
    paymentMethod: text("payment_method"),
    notes: text("notes"),
    saleDate: timestamp("sale_date").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("manual_sales_sale_date_idx").on(table.saleDate),
    index("manual_sales_product_id_idx").on(table.productId),
    index("manual_sales_payment_method_idx").on(table.paymentMethod),
  ]
);
