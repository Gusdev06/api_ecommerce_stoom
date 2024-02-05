import { OffsetGenerator } from "@/core/pagination/adapters/implementations/Offset";
import { TotalPagesGenerator } from "@/core/pagination/adapters/implementations/TotalPagesGenerator";
import { CreateOrderUseCase } from "@/domain/orders/use-cases/create-order";
import { DeleteOrderUseCase } from "@/domain/orders/use-cases/delete-order";
import { EditOrderUseCase } from "@/domain/orders/use-cases/edit-order";
import { EditOrderStatusUseCase } from "@/domain/orders/use-cases/edit-order-status";
import { ListOrdersUseCase } from "@/domain/orders/use-cases/fetch-orders";
import { OrderItemPrismaRepository } from "@/infra/database/repositories/prisma-order-item-repository";
import { OrderPrismaRepository } from "@/infra/database/repositories/prisma-order-repository";
import { ProductPrismaRepository } from "@/infra/database/repositories/prisma-product-repository";
import { CreateOrderController } from "./create-order-controller";
import { DeleteOrderController } from "./delete-order-controller";
import { EditOrderController } from "./edit-order-controller";
import { EditOrderStatusController } from "./edit-status-order-controller";
import { ListOrdersController } from "./fetch-orders-controller";
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

const editOrderStatusUseCase = new EditOrderStatusUseCase(orderRepository);
const editOrderStatusController = new EditOrderStatusController(
    editOrderStatusUseCase,
);
const deleteOrderUseCase = new DeleteOrderUseCase(orderRepository);
const deleteOrderController = new DeleteOrderController(deleteOrderUseCase);

const offsetGenerator = new OffsetGenerator();
const totalPagesGenerator = new TotalPagesGenerator();
const listOrdersUseCase = new ListOrdersUseCase(
    orderRepository,
    offsetGenerator,
    totalPagesGenerator,
);
const listOrdersController = new ListOrdersController(listOrdersUseCase);
export {
    createOrderController,
    deleteOrderController,
    editOrderController,
    editOrderStatusController,
    listOrdersController,
};

