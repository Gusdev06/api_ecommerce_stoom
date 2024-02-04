import { CreateOrderUseCase } from "@/domain/orders/use-cases/create-order";
import { DeleteOrderUseCase } from "@/domain/orders/use-cases/delete-order";
import { EditOrderUseCase } from "@/domain/orders/use-cases/edit-order";
import { OrderItemPrismaRepository } from "@/infra/database/repositories/prisma-order-item-repository";
import { OrderPrismaRepository } from "@/infra/database/repositories/prisma-order-repository";
import { ProductPrismaRepository } from "@/infra/database/repositories/prisma-product-repository";
import { CreateOrderController } from "./create-order-controller";
import { DeleteOrderController } from "./delete-order-controller";
import { EditOrderController } from "./edit-order-controller";

const productRepository = new ProductPrismaRepository();
const orderItensRepository = new OrderItemPrismaRepository();
const orderRepository = new OrderPrismaRepository(orderItensRepository);
const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    productRepository,
);
const createOrderController = new CreateOrderController(createOrderUseCase);

const editOrderUseCase = new EditOrderUseCase(
    orderRepository,
    orderItensRepository,
    productRepository,
);
const editOrderController = new EditOrderController(editOrderUseCase);
const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
const deleteOrderController = new DeleteOrderController(deleteOrderUseCase);

export { createOrderController, deleteOrderController, editOrderController };

