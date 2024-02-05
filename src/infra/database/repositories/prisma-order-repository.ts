import { Order, Status } from "@/domain/orders/entities/order";
import { OrderItemRepository } from "@/domain/orders/repositories/order-item-repository";
import {
    IListOrdersRequest,
    IListOrdersResponse,
    OrderRepository,
} from "@/domain/orders/repositories/order-repository";
import { PrismaClient } from "@prisma/client";
import { context } from "../context";
import { PrismaOrderDetailsMapper } from "../mappers/prisma-order-details-mapper";
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
            this.orderItensRepository.createMany(order.itens.getNewItems()),
            this.orderItensRepository.deleteMany(order.itens.getRemovedItems()),
        ]);
    }
    async updateStatus(order: Order): Promise<void> {
        await this.prismaClient.order.update({
            where: { id: order.id.toString() },
            data: { status: order.status as Status },
        });
    }

    async create(order: Order): Promise<void> {
        const data = PrismaOrderMapper.toPersistence(order);

        await this.prismaClient.order.create({
            data,
        });

        await this.orderItensRepository.createMany(order.itens.getItems());
    }

    async delete(order: Order): Promise<void> {
        await this.prismaClient.orderItem.deleteMany({
            where: { orderId: order.id.toString() },
        });
        await this.prismaClient.order.delete({
            where: { id: order.id.toString() },
        });
    }

    async list({
        limit,
        offset,
    }: IListOrdersRequest): Promise<IListOrdersResponse | null> {
        const count = await this.prismaClient.order.count({});

        const ordersP = await this.prismaClient.order.findMany({
            take: limit,
            skip: offset,
            include: {
                user: true,
                itens: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!ordersP) return null;

        const orders = await Promise.all(
            ordersP.map(async (orderP) => {
                return PrismaOrderDetailsMapper.toDomain(orderP);
            }),
        );

        return {
            orders,
            count,
        };
    }
}

export { OrderPrismaRepository };

