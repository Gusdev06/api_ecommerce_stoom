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
    async deleteMany(orderItens: OrderItem[]): Promise<void> {
        if (orderItens.length === 0) {
            return;
        }

        const ordersId = orderItens.map((orderItem) =>
            orderItem.orderId.toString(),
        );

        await this.prismaClient.orderItem.deleteMany({
            where: {
                orderId: {
                    in: ordersId,
                },
            },
        });
    }
    async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
        const orderItens = await this.prismaClient.orderItem.findMany({
            where: {
                orderId,
            },
        });

        return orderItens.map(PrismaOrderItemMapper.toDomain);
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

