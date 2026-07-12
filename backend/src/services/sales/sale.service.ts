import { saleRepository } from "../../repositories/sales/sale.repository.js";
import { productRepository } from "../../repositories/products/product.repository.js";
import type { CreateSaleDto, UpdateSaleDto } from "../../validators/sale.validator.js";
import type { SaleFilterDto } from "../../validators/pagination.validator.js";

export class SaleService {
  async getAll(filters: SaleFilterDto) {
    return saleRepository.findAll(filters);
  }

  async getById(id: string) {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw Object.assign(new Error("Sale not found"), { statusCode: 404 });
    }
    return sale;
  }

  async create(data: CreateSaleDto) {
    const product = await productRepository.findById(data.productId);
    if (!product) {
      throw Object.assign(new Error("Product not found"), { statusCode: 404 });
    }

    return saleRepository.create(data);
  }

  async update(id: string, data: UpdateSaleDto) {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw Object.assign(new Error("Sale not found"), { statusCode: 404 });
    }

    if (data.productId) {
      const product = await productRepository.findById(data.productId);
      if (!product) {
        throw Object.assign(new Error("Product not found"), { statusCode: 404 });
      }
    }

    return saleRepository.update(id, data);
  }

  async delete(id: string) {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      throw Object.assign(new Error("Sale not found"), { statusCode: 404 });
    }
    return saleRepository.delete(id);
  }
}

export const saleService = new SaleService();
