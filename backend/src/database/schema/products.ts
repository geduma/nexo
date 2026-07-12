import { pgTable, text, integer, boolean, timestamp, uuid, numeric, index } from "drizzle-orm/pg-core";
import { categories } from "./categories.js";
import { productAvailabilityStatusEnum } from "./enums.js";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull(),
    description: text("description"),
    priceCost: numeric("price_cost", { precision: 12, scale: 2 }).notNull().default("0"),
    priceSale: numeric("price_sale", { precision: 12, scale: 2 }).notNull(),
    availabilityStatus: productAvailabilityStatusEnum("availability_status")
      .default("IN_STOCK")
      .notNull(),
    supplierInfo: text("supplier_info"),
    isFeatured: boolean("is_featured").default(false).notNull(),
    isVisible: boolean("is_visible").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_availability_status_idx").on(table.availabilityStatus),
    index("products_is_featured_idx").on(table.isFeatured),
    index("products_is_visible_idx").on(table.isVisible),
    index("products_name_idx").on(table.name),
  ]
);
