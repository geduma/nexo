import { productRepository } from "../../repositories/products/product.repository.js";
import { categoryRepository } from "../../repositories/categories/category.repository.js";
import { imageRepository } from "../../repositories/images/image.repository.js";
import type { CreateProductDto, UpdateProductDto } from "../../validators/product.validator.js";
import type { ProductFilterDto } from "../../validators/pagination.validator.js";

export class ProductService {
  async getAll(filters: ProductFilterDto) {
    return productRepository.findAll(filters);
  }

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    }
    const images = await imageRepository.findByProduct(id);
    return { ...product, images };
  }

  async getPublicById(id: string) {
    const product = await productRepository.findById(id);
    if (!product || !product.isVisible) {
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    }
    const images = await imageRepository.findByProduct(id);
    return { ...product, images };
  }

  async create(data: CreateProductDto) {
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw Object.assign(new Error("Category not found"), { statusCode: 404 });
    }

    return productRepository.create(data);
  }

  async update(id: string, data: UpdateProductDto) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    }

    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        throw Object.assign(new Error("Category not found"), { statusCode: 404 });
      }
    }

    return productRepository.update(id, data);
  }

  async delete(id: string) {
    const product = await productRepository.findById(id);
    if (!product) {
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    }

    await imageRepository.deleteByProduct(id);
    return productRepository.delete(id);
  }

  async countAll() {
    return productRepository.count();
  }

  async countVisible() {
    return productRepository.countVisible();
  }

  async search(query: string) {
    return productRepository.search(query);
  }

  async getRelatedProducts(id: string) {
    const product = await productRepository.findById(id);
    if (!product) return [];

    const filters: ProductFilterDto = {
      page: 1,
      limit: 4,
      sortBy: "created_at",
      sortOrder: "DESC",
      category: product.categoryId,
      visible: true,
    };

    const result = await productRepository.findAll(filters);
    return result.data.filter((p: (typeof result.data)[number]) => p.id !== id).slice(0, 4);
  }
}

export const productService = new ProductService();
