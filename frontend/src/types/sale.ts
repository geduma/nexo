import type { Product } from "./product";

export interface ManualSale {
  id: string;
  productId: string;
  customerName: string;
  customerContact: string | null;
  quantity: number;
  salePrice: number;
  paymentMethod: string | null;
  notes: string | null;
  saleDate: string;
  createdAt: string;
  updatedAt: string;
  productName?: string | null;
  product?: Product;
}
