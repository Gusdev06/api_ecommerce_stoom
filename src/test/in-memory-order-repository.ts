import { Order } from "@/domain/orders/entities/order";
import { OrderDetails } from "@/domain/orders/entities/value-objects/order-details";
import {
    IListOrdersRequest,
    IListOrdersResponse,
    OrderRepository,
} from "@/domain/orders/repositories/order-repository";
import { InMemoryOrderItemRepository } from "./in-memory-order-item-repository";

export class InMemoryOrderRepository implements OrderRepository {
    public items: Order[] = [];
    public itemsDetails: OrderDetails[] = [];
    constructor(
        private inMemoryOrderItemRepository: InMemoryOrderItemRepository,
    ) {}

    async findById(id: string): Promise<Order | null> {
        const order = this.items.find((order) => order.id.toString() === id);

        return order || null;
    }

    async updateStatus(order: Order): Promise<void> {
        const index = this.items.findIndex((p) => p.id.equals(order.id));

        this.items[index] = order;
    }
    async save(order: Order): Promise<void> {
        const index = this.items.findIndex((p) => p.id.equals(order.id));

        this.items[index] = order;
        await this.inMemoryOrderItemRepository.createMany(
            order.itens.getNewItems(),
        );
        await this.inMemoryOrderItemRepository.deleteMany(
            order.itens.getRemovedItems(),
        );
    }

    async create(order: Order): Promise<void> {
        this.items.push(order);
        await this.inMemoryOrderItemRepository.createMany(
            order.itens.getItems(),
        );
    }

    async delete(order: Order): Promise<void> {
        this.items = this.items.filter((p) => !p.id.equals(order.id));
    }

    async list({
        search,
        limit,
        offset,
    }: IListOrdersRequest): Promise<IListOrdersResponse> {
        let filteredOrders = this.itemsDetails;

        const startIndex = offset || 0;
        const endIndex = startIndex + (limit || this.items.length);
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
        return {
            orders: paginatedOrders,
            count: this.items.length,
        };
    }
}

