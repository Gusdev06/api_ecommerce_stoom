import { OrderItem } from "@/domain/orders/entities/order-item";
import { OrderItemRepository } from "@/domain/orders/repositories/order-item-repository";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { PrismaOrderItemMapper } from "../mappers/prisma-order-item-mapper";

class OrderItemPrismaRepository implements OrderItemRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = context.prisma;
    }
    deleteMany(orderItens: OrderItem[]): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findManyByOrderId(orderId: string): Promise<OrderItem[]> {
        throw new Error("Method not implemented.");
    }
    deleteManyByOrderId(orderId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createMany(OrderItem: OrderItem[]): Promise<void> {
        const data = OrderItem.map((orderItem) => {
            return PrismaOrderItemMapper.toPersistence(orderItem);
        });

        await this.prismaClient.orderItem.createMany({
            data,
        });
    }
}

export { OrderItemPrismaRepository };

