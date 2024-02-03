import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderOrderitem } from "@/domain/orders/entities/order-order-item";
import { OrderItem as PrismaOrderItem } from "@prisma/client";

export class PrismaOrderOrderItemMapper {
    static toDomain(raw: PrismaOrderItem): OrderOrderitem {
        if (!raw.orderId) throw new Error("OrderItem id not found");
        return OrderOrderitem.create({
            orderId: new UniqueEntityID(raw.orderId),
            orderItemId: new UniqueEntityID(raw.id),
        });
        new UniqueEntityID(raw.id);
    }
}

