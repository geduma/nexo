import { pgTable, text, integer, boolean, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { products } from "./products.js";

export const productImages = pgTable(
  "product_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    isPrimary: boolean("is_primary").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_images_product_id_idx").on(table.productId),
    index("product_images_display_order_idx").on(table.displayOrder),
  ]
);
