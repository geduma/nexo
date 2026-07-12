export const API_VERSION = "v1";
export const API_BASE_PATH = `/api/${API_VERSION}`;

export const MAX_PRODUCT_IMAGES = 5;
export const MIN_PRODUCT_IMAGES = 1;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 50;

export const DEFAULT_CURRENCY = "COP";
export const DEFAULT_CURRENCY_SYMBOL = "$";
export const DEFAULT_LANGUAGE = "es";
export const DEFAULT_THEME = "system";

export const SEARCH_DEBOUNCE_MS = 300;

export const WHATSAPP_BASE_URL = "https://wa.me";

export const PRODUCT_STORAGE_PATH = "product-images";
