import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: text("business_name").default("NEXO").notNull(),
  logoUrl: text("logo_url"),
  currency: text("currency").default("COP").notNull(),
  currencySymbol: text("currency_symbol").default("$").notNull(),
  defaultLanguage: text("default_language").default("es").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  theme: text("theme").default("system").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
