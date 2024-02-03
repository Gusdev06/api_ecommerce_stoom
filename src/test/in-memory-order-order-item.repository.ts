import { OrderOrderitem } from "@/domain/orders/entities/order-order-item";
import { OrderOrderItemRepository } from "@/domain/orders/repositories/order-order-item-repository";

export class InMemoryOrderOrderItemRepository
    implements OrderOrderItemRepository
{
    public items: OrderOrderitem[] = [];

    async createMany(orderItens: OrderOrderitem[]): Promise<void> {
        this.items.push(...orderItens);
    }

    async deleteMany(orderItens: OrderOrderitem[]): Promise<void> {
        const orderOrderIten = this.items.filter(
            (item) => !orderItens.some((orderItem) => orderItem.equals(item)),
        );

        this.items = orderOrderIten;
    }

    async findManyByOrderId(orderId: string): Promise<OrderOrderitem[]> {
        return this.items.filter(
            (orderOrderItem) => orderOrderItem.orderId.toString() === orderId,
        );
    }

    async deleteManyByOrderId(orderId: string): Promise<void> {
        const orderOrderItens = this.items.filter(
            (orderOrderItem) => orderOrderItem.orderId.toString() !== orderId,
        );

        this.items = orderOrderItens;
    }
}

