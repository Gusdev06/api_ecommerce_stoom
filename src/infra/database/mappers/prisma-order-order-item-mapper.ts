import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderOrderitem } from "@/domain/orders/entities/order-order-item";
import { Prisma, OrderItem as PrismaOrderItem } from "@prisma/client";

export class PrismaOrderOrderItemMapper {
    static toDomain(raw: PrismaOrderItem): OrderOrderitem {
        if (!raw.orderId) throw new Error("OrderItem id not found");
        return OrderOrderitem.create({
            orderId: new UniqueEntityID(raw.orderId),
            orderItensIds: new UniqueEntityID(raw.id),
        });
        new UniqueEntityID(raw.id);
    }

    static toPrismaUpdateMany(
        orderItem: OrderOrderitem[],
    ): Prisma.OrderItemUpdateManyArgs {
        const orderItemId = orderItem.map((orderItem) => {
            return orderItem.orderItensIds.toString();
        });

        return {
            where: {
                id: {
                    in: orderItemId,
                },
            },
            data: {
                orderId: orderItem[0].orderId.toString(),
            },
        };
    }
}

