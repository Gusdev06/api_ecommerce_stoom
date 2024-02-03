import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
    OrderOrderitem,
    OrderOrderitemProps,
} from "@/domain/orders/entities/order-order-item";

export function makeOrderOrderItem(
    override: Partial<OrderOrderitemProps> = {},
    id?: UniqueEntityID,
) {
    const orderorderitem = OrderOrderitem.create(
        {
            orderId: new UniqueEntityID(),
            orderItensIds: new UniqueEntityID(),
            ...override,
        },
        id,
    );

    return orderorderitem;
}

