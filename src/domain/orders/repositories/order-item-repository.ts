import { OrderItem } from "../entities/order-item";

export abstract class OrderItemRepository {
    abstract createMany(OrderItem: OrderItem[]): Promise<void>;
    abstract deleteMany(orderItens: OrderItem[]): Promise<void>;
    abstract findManyByOrderId(orderId: string): Promise<OrderItem[]>;
    abstract deleteManyByOrderId(orderId: string): Promise<void>;
}

