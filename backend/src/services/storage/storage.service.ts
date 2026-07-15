import { supabase } from "../../config/database.js";
import { env } from "../../config/env.js";
import { logger } from "../../config/logger.js";
import { v4 as uuidv4 } from "uuid";

const STORAGE_FOLDER = "";

export class StorageService {
  async ensureBucket(): Promise<boolean> {
    const { data: objects, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .list(undefined, { limit: 1 });

    if (error) {
      if (error.message?.includes("Bucket not found")) {
        logger.warn(
          `Storage bucket "${env.SUPABASE_STORAGE_BUCKET}" does not exist. ` +
            `Create it in your Supabase Dashboard at Storage → New bucket, ` +
            `name: "${env.SUPABASE_STORAGE_BUCKET}", public: true`
        );
        return false;
      }

      if (error.message?.includes("row-level security")) {
        logger.warn(
          `Storage bucket "${env.SUPABASE_STORAGE_BUCKET}" exists but the anon key ` +
            `has no SELECT permission on storage.objects. ` +
            `Run this SQL in the Supabase SQL Editor:\n` +
            `CREATE POLICY "anon_all_product_images" ON storage.objects FOR ALL TO anon ` +
            `USING (bucket_id = '${env.SUPABASE_STORAGE_BUCKET}') ` +
            `WITH CHECK (bucket_id = '${env.SUPABASE_STORAGE_BUCKET}');`
        );
        return true;
      }

      logger.warn(`Storage bucket check failed: ${error.message}`);
      return false;
    }

    logger.info(`Storage bucket "${env.SUPABASE_STORAGE_BUCKET}" found`);
    return true;
  }

  async uploadImage(productId: string, file: Express.Multer.File): Promise<string> {
    const timestamp = Date.now();
    const extension = file.originalname.split(".").pop() ?? "jpg";
    const filename = `${uuidv4()}-${timestamp}.${extension}`;
    const path = `${STORAGE_FOLDER}${productId}/${filename}`;

    const { data: uploadData, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      logger.error("Supabase upload error details", {
        message: error.message,
        name: error.name,
        statusCode: (error as any).statusCode,
        bucket: env.SUPABASE_STORAGE_BUCKET,
        path,
      });

      let hint = "";
      if (error.message?.includes("row-level security")) {
        hint =
          " Run this SQL in Supabase SQL Editor:\n" +
          `CREATE POLICY "anon_all_product_images" ON storage.objects FOR ALL TO anon ` +
          `USING (bucket_id = '${env.SUPABASE_STORAGE_BUCKET}') ` +
          `WITH CHECK (bucket_id = '${env.SUPABASE_STORAGE_BUCKET}');`;
      }

      throw Object.assign(new Error(`Storage upload failed: ${error.message}${hint}`), { statusCode: 500 });
    }

    return await this.getSignedUrl(path);
  }

  async getSignedUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(path, 7 * 24 * 3600);

    if (error || !data?.signedUrl) {
      logger.error("Failed to get signed URL", { path, error: error?.message });
      const { data: publicUrlData } = supabase.storage
        .from(env.SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(path);
      return publicUrlData.publicUrl;
    }

    return data.signedUrl;
  }

  extractBucketPath(imageUrl: string): string | null {
    const patterns = [
      `/object/public/${env.SUPABASE_STORAGE_BUCKET}/`,
      `/object/sign/${env.SUPABASE_STORAGE_BUCKET}/`,
    ];
    for (const pattern of patterns) {
      const parts = imageUrl.split(pattern);
      if (parts.length > 1) {
        const path = parts[1];
      if (path) {
        return path.split("?")[0] ?? null;
      }
      return null;
      }
    }
    return null;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const bucketPath = this.extractBucketPath(imageUrl);
    if (!bucketPath) return;

    const { error } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .remove([bucketPath]);

    if (error) {
      logger.error("Supabase delete error", {
        message: error.message,
        name: error.name,
        bucket: env.SUPABASE_STORAGE_BUCKET,
        path: bucketPath,
      });
    }
  }

  async getPublicUrl(path: string): Promise<string> {
    return this.getSignedUrl(path);
  }
}

export const storageService = new StorageService();
