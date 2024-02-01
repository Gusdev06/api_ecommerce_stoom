import { CreateProductUseCase } from "@/domain/products/use-cases/create-product";
import { CreateProductController } from "./create-product-controller";

import { ProductPrismaRepository } from "@/infra/database/repositories/prisma-product-repository";

const productRepository = new ProductPrismaRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const createProductController = new CreateProductController(
    createProductUseCase,
);

export { createProductController };

