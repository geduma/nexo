import { categoryRepository } from "../../repositories/categories/category.repository.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "../../validators/category.validator.js";
import type { PaginationDto } from "../../validators/pagination.validator.js";

export class CategoryService {
  async getAll(pagination: PaginationDto, search?: string) {
    return categoryRepository.findAll(pagination, search);
  }

  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw Object.assign(new Error("Category not found"), { statusCode: 404 });
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const existing = await categoryRepository.findByName(data.name);
    if (existing) {
      throw Object.assign(new Error("Category name already exists"), { statusCode: 409 });
    }
    return categoryRepository.create(data);
  }

  async update(id: string, data: UpdateCategoryDto) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw Object.assign(new Error("Category not found"), { statusCode: 404 });
    }

    if (data.name) {
      const existing = await categoryRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw Object.assign(new Error("Category name already exists"), { statusCode: 409 });
      }
    }

    return categoryRepository.update(id, data);
  }

  async delete(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw Object.assign(new Error("Category not found"), { statusCode: 404 });
    }

    const productCount = await categoryRepository.countProducts(id);
    if (productCount > 0) {
      throw Object.assign(new Error("Cannot delete category with products"), { statusCode: 409 });
    }

    return categoryRepository.delete(id);
  }

  async countAll() {
    const result = await categoryRepository.findAll({ page: 1, limit: 1, sortBy: "created_at", sortOrder: "DESC" });
    return result.pagination.total;
  }
}

export const categoryService = new CategoryService();
