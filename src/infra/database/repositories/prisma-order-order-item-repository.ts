import { OrderOrderitem } from "@/domain/orders/entities/order-order-item";
import { OrderOrderItemRepository } from "@/domain/orders/repositories/order-order-item-repository";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { PrismaOrderOrderItemMapper } from "../mappers/prisma-order-order-item-mapper";

class OrderOrderItemPrismaRepository implements OrderOrderItemRepository {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = context.prisma;
    }

    async findManyByOrderId(orderId: string): Promise<OrderOrderitem[]> {
        const orderItems = await this.prismaClient.orderItem.findMany({
            where: { orderId },
        });

        return orderItems.map(PrismaOrderOrderItemMapper.toDomain);
    }

    async deleteManyByOrderId(orderId: string): Promise<void> {
        await this.prismaClient.orderItem.deleteMany({
            where: { orderId },
        });
    }

    async createMany(orderItensId: OrderOrderitem[]): Promise<void> {
        if (orderItensId.length === 0) {
            return;
        }

        const data =
            PrismaOrderOrderItemMapper.toPrismaUpdateMany(orderItensId);

        await this.prismaClient.orderItem.updateMany(data);
    }

    async deleteMany(orderItensId: OrderOrderitem[]): Promise<void> {
        if (orderItensId.length === 0) {
            return;
        }

        const orderItemId = orderItensId.map((orderItem) => {
            return orderItem.id.toString();
        });

        await this.prismaClient.orderItem.deleteMany({
            where: {
                id: {
                    in: orderItemId,
                },
            },
        });
    }
}

export { OrderOrderItemPrismaRepository };

