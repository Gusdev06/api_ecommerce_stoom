import { Either, left, right } from "@/core/either";

import { IUseCase } from "@/core/protocols/IUseCase";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/products/errors/not-found-error";
import { Order } from "../entities/order";
import { OrderOrderitem } from "../entities/order-order-item";
import { OrderOrderitemList } from "../entities/order-order-item-list";
import { OrderOrderItemRepository } from "../repositories/order-order-item-repository";
import { OrderRepository } from "../repositories/order-repository";

interface EditOrderUseCaseRequest {
    id: string;
    status: string;
    orderItensIds: string[];
}

type EditOrderUseCaseResponse = Either<
    NotFoundError,
    {
        order: Order;
    }
>;

export class EditOrderUseCase
    implements IUseCase<EditOrderUseCaseRequest, EditOrderUseCaseResponse>
{
    constructor(
        private orderRepository: OrderRepository,
        private orderOrderItemRepository: OrderOrderItemRepository,
    ) {}

    async execute({
        id,
        status,
        orderItensIds,
    }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            return left(new NotFoundError());
        }

        const currentOrderOrderItens =
            await this.orderOrderItemRepository.findManyByOrderId(id);

        const orderOrderItemList = new OrderOrderitemList(
            currentOrderOrderItens,
        );
        const orderOrderItens = orderItensIds.map((orderItemId) => {
            return OrderOrderitem.create({
                orderItensIds: new UniqueEntityID(orderItemId),
                orderId: order.id,
            });
        });

        orderOrderItemList.update(orderOrderItens);

        order.status = status;
        order.itens = orderOrderItemList;

        await this.orderRepository.save(order);

        return right({
            order,
        });
    }
}

