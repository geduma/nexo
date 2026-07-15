export enum ProductAvailabilityStatus {
  IN_STOCK = "IN_STOCK",
  CHECK_SUPPLIER = "CHECK_SUPPLIER",
}

export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceCost: number;
  priceSale: number;
  availabilityStatus: ProductAvailabilityStatus;
  supplierInfo: string | null;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  displayOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

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
  product?: Product;
}

export interface Settings {
  id: string;
  businessName: string;
  logoUrl: string | null;
  currency: string;
  currencySymbol: string;
  defaultLanguage: string;
  whatsappNumber: string;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSummary {
  totalRevenue: number;
  totalSales: number;
  averageSale: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    totalQuantity: number;
    totalRevenue: number;
  }>;
  salesByDay: Array<{
    date: string;
    revenue: number;
    count: number;
  }>;
}
