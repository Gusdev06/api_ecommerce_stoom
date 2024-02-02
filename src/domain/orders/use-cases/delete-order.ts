import { Either, left, right } from "@/core/either";
import { IUseCase } from "@/core/protocols/IUseCase";

import { NotFoundError } from "@/domain/products/errors/not-found-error";
import { Order } from "../entities/order";
import { OrderRepository } from "../repositories/order-repository";

interface DeleteOrderUseCaseRequest {
    id: string;
}

type DeleteOrderUseCaseResponse = Either<
    NotFoundError,
    {
        order: Order;
    }
>;

export class DeleteOrderUseCase
    implements IUseCase<DeleteOrderUseCaseRequest, DeleteOrderUseCaseResponse>
{
    constructor(private orderRepository: OrderRepository) {}

    async execute({
        id,
    }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            return left(new NotFoundError());
        }

        await this.orderRepository.delete(order);

        return right({
            order,
        });
    }
}

