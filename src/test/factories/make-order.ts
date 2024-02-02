import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderProps } from "@/domain/orders/entities/order";

import { faker } from "@faker-js/faker";

export function makeOrder(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityID,
) {
    const order = Order.create(
        {
            userId: new UniqueEntityID(),
            status: "pending",
            total: faker.number.float(),
            updatedAt: undefined,
            ...override,
        },
        id,
    );

    return order;
}

