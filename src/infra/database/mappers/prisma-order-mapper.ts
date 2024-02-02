import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order } from "@/domain/orders/entities/Order";
import { Prisma, Order as PrismaOrder } from "@prisma/client";

export class PrismaOrderMapper {
    static toDomain(raw: PrismaOrder): Order {
        return Order.create(
            {
                name: raw.name,
                description: raw.description,
                price: raw.price,
                inStock: raw.inStock,
            },
            new UniqueEntityID(raw.id),
        );
    }

    static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
        return {
            id: order.id.toString(),
            name: order.name,
            description: order.description,
            price: order.price,
            inStock: order.inStock,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}

