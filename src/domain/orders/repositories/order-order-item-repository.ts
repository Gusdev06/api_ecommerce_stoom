import { OrderOrderitem } from "../entities/order-order-item";

export abstract class OrderOrderItemRepository {
    abstract createMany(orderItens: OrderOrderitem[]): Promise<void>;
    abstract deleteMany(orderItens: OrderOrderitem[]): Promise<void>;
    abstract findManyByOrderId(orderId: string): Promise<OrderOrderitem[]>;
    abstract deleteManyByOrderId(orderId: string): Promise<void>;
}

