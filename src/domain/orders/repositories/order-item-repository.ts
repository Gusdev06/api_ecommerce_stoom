import { OrderItem } from "../entities/order-item";

export abstract class OrderItemRepository {
    abstract create(orderItem: OrderItem): Promise<void>;
}

