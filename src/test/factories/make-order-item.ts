import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderItem, OrderItemProps } from "@/domain/orders/entities/order-item";

export function makeOrderitem(
    override: Partial<OrderItemProps> = {},
    id?: UniqueEntityID,
) {
    const orderitem = OrderItem.create(
        {
            orderId: new UniqueEntityID(),
            productId: new UniqueEntityID(),
            quantity: 1,
            price: 10,
            createdAt: new Date(),
            ...override,
        },
        id,
    );

    return orderitem;
}

