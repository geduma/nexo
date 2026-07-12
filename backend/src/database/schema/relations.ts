import { relations } from "drizzle-orm";
import { categories } from "./categories.js";
import { products } from "./products.js";
import { productImages } from "./product-images.js";
import { manualSales } from "./manual-sales.js";

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  images: many(productImages),
  sales: many(manualSales),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const manualSalesRelations = relations(manualSales, ({ one }) => ({
  product: one(products, {
    fields: [manualSales.productId],
    references: [products.id],
  }),
}));
