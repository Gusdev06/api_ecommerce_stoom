import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Order, OrderProps, Status } from "@/domain/orders/entities/order";

import { faker } from "@faker-js/faker";

export function makeOrder(
    override: Partial<OrderProps> = {},
    id?: UniqueEntityID,
) {
    const order = Order.create(
        {
            userId: new UniqueEntityID(),
            status: Status.NEW_ORDER,
            total: faker.number.float(),
            adress: faker.location.country(),
            updatedAt: undefined,
            ...override,
        },
        id,
    );

    return order;
}

