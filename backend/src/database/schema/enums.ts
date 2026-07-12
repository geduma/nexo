import { pgEnum } from "drizzle-orm/pg-core";

export const productAvailabilityStatusEnum = pgEnum("product_availability_status", [
  "IN_STOCK",
  "CHECK_SUPPLIER",
]);
