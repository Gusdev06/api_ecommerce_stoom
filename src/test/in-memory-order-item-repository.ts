import { OrderItem } from "@/domain/orders/entities/order-item";
import { OrderItemRepository } from "@/domain/orders/repositories/order-item-repository";

export class InMemoryOrderItemRepository implements OrderItemRepository {
    public items: OrderItem[] = [];

    async findById(id: string): Promise<OrderItem | null> {
        const orderitem = this.items.find(
            (orderitem) => orderitem.id.toString() === id,
        );

        return orderitem || null;
    }

    async createMany(orderItens: OrderItem[]): Promise<void> {
        this.items.push(...orderItens);
    }

    async deleteMany(orderItens: OrderItem[]): Promise<void> {
        const orderOrderIten = this.items.filter(
            (item) => !orderItens.some((orderItem) => orderItem.equals(item)),
        );

        this.items = orderOrderIten;
    }

    async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
        return this.items.filter(
            (orderOrderItem) => orderOrderItem.orderId.toString() === orderId,
        );
    }

    async deleteManyByOrderId(orderId: string): Promise<void> {
        const orderItens = this.items.filter(
            (orderOrderItem) => orderOrderItem.orderId.toString() !== orderId,
        );

        this.items = orderItens;
    }

    // async list({
    //     search,
    //     limit,
    //     offset,
    // }: IListOrderItemsRequest): Promise<IListOrderItemsResponse> {
    //     let filteredOrderItems = this.items;

    //     if (search) {
    //         filteredOrderItems = this.items.filter((user) =>
    //             user.name.toLowerCase().includes(search.toLowerCase()),
    //         );
    //     }

    //     const startIndex = offset || 0;
    //     const endIndex = startIndex + (limit || this.items.length);
    //     const paginatedOrderItems = filteredOrderItems.slice(startIndex, endIndex);
    //     return {
    //         orderitems: paginatedOrderItems,
    //         count: this.items.length,
    //     };
    // }
}

