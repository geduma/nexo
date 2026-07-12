import type { ProductAvailabilityStatus } from "./api";
import type { Category } from "./category";
import type { ProductImage } from "./product-image";

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceCost: number;
  priceSale: number;
  availabilityStatus: ProductAvailabilityStatus;
  supplierInfo: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  images?: ProductImage[];
}
