import { env } from "../../config/env.js";
import { v4 as uuidv4 } from "uuid";

const PRODUCT_STORAGE_PATH = "product-images";

export class StorageService {
  async uploadImage(productId: string, file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const filename = `${uuidv4()}-${timestamp}-${file.originalname}`;
    const path = `${PRODUCT_STORAGE_PATH}/${productId}/${filename}`;

    // In a real implementation, this would upload to Supabase Storage
    // For now, we return a placeholder URL
    const publicUrl = `${env.SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/${path}`;

    return publicUrl;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    // In a real implementation, this would delete from Supabase Storage
    // Extract path from URL and delete
    console.log("Deleting image:", imageUrl);
  }

  getPublicUrl(path: string): string {
    return `${env.SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/${path}`;
  }
}

export const storageService = new StorageService();
