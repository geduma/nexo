import { imageRepository } from "../../repositories/images/image.repository.js";
import { productRepository } from "../../repositories/products/product.repository.js";
import { storageService } from "../storage/storage.service.js";

const MAX_PRODUCT_IMAGES = 5;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export class ImageService {
  async getByProduct(productId: string) {
    return imageRepository.findByProduct(productId);
  }

  async upload(productId: string, file: Express.Multer.File, displayOrder: number, isPrimary: boolean) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    }

    const imageCount = await imageRepository.countByProduct(productId);
    if (imageCount >= MAX_PRODUCT_IMAGES) {
      throw Object.assign(new Error(`Maximum ${MAX_PRODUCT_IMAGES} images allowed`), { statusCode: 422 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw Object.assign(new Error("Invalid file type. Allowed: JPEG, PNG, WEBP"), { statusCode: 422 });
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw Object.assign(new Error("File size must be less than 5MB"), { statusCode: 422 });
    }

    const imageUrl = await storageService.uploadImage(productId, file);

    if (isPrimary) {
      await imageRepository.unsetPrimaryForProduct(productId);
    }

    const image = await imageRepository.create({
      productId,
      imageUrl,
      displayOrder,
      isPrimary,
    });

    if (imageCount === 0 && !isPrimary && image) {
      await imageRepository.update(image.id, { isPrimary: true });
    }

    return image;
  }

  async update(imageId: string, data: { displayOrder?: number; isPrimary?: boolean }) {
    const image = await imageRepository.findById(imageId);
    if (!image) {
      throw Object.assign(new Error("Image not found"), { statusCode: 404 });
    }

    if (data.isPrimary) {
      await imageRepository.unsetPrimaryForProduct(image.productId);
    }

    return imageRepository.update(imageId, data);
  }

  async delete(imageId: string) {
    const image = await imageRepository.findById(imageId);
    if (!image) {
      throw Object.assign(new Error("Image not found"), { statusCode: 404 });
    }

    await storageService.deleteImage(image.imageUrl);
    await imageRepository.delete(imageId);

    if (image.isPrimary) {
      await imageRepository.setPrimaryForProduct(image.productId);
    }
  }
}

export const imageService = new ImageService();
