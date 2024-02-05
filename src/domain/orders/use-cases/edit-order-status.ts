import { Either, left, right } from "@/core/either";

import { IUseCase } from "@/core/protocols/IUseCase";

import { Order, Status } from "../entities/order";
import { InvalidStatusError } from "../errors/invalid-status-error";
import { NotFoundError } from "../errors/not-found-error";
import { QuantityError } from "../errors/quantity-error";
import { OrderRepository } from "../repositories/order-repository";

interface EditOrderStatusUseCaseRequest {
    id: string;
    status: Status;
}

type EditOrderStatusUseCaseResponse = Either<
    NotFoundError | QuantityError | InvalidStatusError,
    {
        order: Order;
    }
>;

export class EditOrderStatusUseCase
    implements
        IUseCase<EditOrderStatusUseCaseRequest, EditOrderStatusUseCaseResponse>
{
    constructor(private orderRepository: OrderRepository) {}

    async execute({
        id,
        status,
    }: EditOrderStatusUseCaseRequest): Promise<EditOrderStatusUseCaseResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            return left(new NotFoundError());
        }

        if (
            status !== Status.NEW_ORDER &&
            status !== Status.PROCESSING_ORDER &&
            status !== Status.DELIVERED_ORDER &&
            status !== Status.DISPATCHED_ORDER
        ) {
            return left(new InvalidStatusError());
        }

        order.status = status;

        await this.orderRepository.updateStatus(order);

        return right({
            order,
        });
    }
}

