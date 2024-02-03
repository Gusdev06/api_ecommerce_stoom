import { CreateOrderUseCase } from "@/domain/orders/use-cases/create-order";
import { OrderPrismaRepository } from "@/infra/database/repositories/prisma-order-repository";
import { CreateOrderController } from "./create-order-controller";

import { OrderItemPrismaRepository } from "@/infra/database/repositories/prisma-order-item-repository";
import { ProductPrismaRepository } from "@/infra/database/repositories/prisma-product-repository";

const productRepository = new ProductPrismaRepository();
const orderItensRepository = new OrderItemPrismaRepository();
const orderRepository = new OrderPrismaRepository(orderItensRepository);
const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    productRepository,
);
const createOrderController = new CreateOrderController(createOrderUseCase);

export { createOrderController };

