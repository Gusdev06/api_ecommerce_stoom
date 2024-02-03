import { Order } from "@/domain/orders/entities/order";
import { OrderItemRepository } from "@/domain/orders/repositories/order-item-repository";
import { OrderRepository } from "@/domain/orders/repositories/order-repository";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";

class OrderPrismaRepository implements OrderRepository {
    private prismaClient: PrismaClient;

    constructor(private orderItensRepository: OrderItemRepository) {
        this.prismaClient = context.prisma;
    }

    async findById(id: string): Promise<Order | null> {
        const order = await this.prismaClient.order.findFirst({
            where: { id },
        });

        if (!order) {
            return null;
        }

        return PrismaOrderMapper.toDomain(order);
    }

    async save(order: Order): Promise<void> {
        const data = PrismaOrderMapper.toPersistence(order);

        await Promise.all([
            this.prismaClient.order.update({
                where: { id: data.id },
                data,
            }),
            this.orderItensRepository.createMany(order.itens.getItems()),
        ]);
    }

    async create(order: Order): Promise<void> {
        const data = PrismaOrderMapper.toPersistence(order);

        await this.prismaClient.order.create({
            data,
        });

        await this.orderItensRepository.createMany(order.itens.getItems());
    }

    async delete(order: Order): Promise<void> {
        await this.prismaClient.order.delete({
            where: { id: order.id.toString() },
        });
    }
}

export { OrderPrismaRepository };

