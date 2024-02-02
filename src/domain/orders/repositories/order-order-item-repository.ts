import { OrderOrderitem } from "../entities/order-order-item";

export abstract class OrderOrderItemRepository {
    abstract findManyByOrderId(orderId: string): Promise<OrderOrderitem[]>;
    abstract deleteManyByOrderId(orderId: string): Promise<void>;
}

