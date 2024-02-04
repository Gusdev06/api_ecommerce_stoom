import { Either, left, right } from "@/core/either";
import { OrderItemRepository } from "@/domain/orders/repositories/order-item-repository";
import { ProductRepository } from "@/domain/products/repositories/product-repository";

import { IUseCase } from "@/core/protocols/IUseCase";

import { NotFoundError } from "@/domain/products/errors/not-found-error";
import { Order } from "../entities/order";
import { OrderItem, OrderItemProps } from "../entities/order-item";
import { OrderitemList } from "../entities/order-item-list";
import { OrderRepository } from "../repositories/order-repository";

interface EditOrderUseCaseRequest {
    id: string;
    itens: OrderItemProps[];
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
        private orderItemRepository: OrderItemRepository,
        private productRepository: ProductRepository,
    ) {}

    async execute({
        id,
        itens,
    }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
        const order = await this.orderRepository.findById(id);

        if (!order) {
            return left(new NotFoundError());
        }
        const currentOrderItens =
            await this.orderItemRepository.findManyByOrderId(
                order.id.toString(),
            );

        const orderList = new OrderitemList(currentOrderItens);

        const orderItens = itens.map((item) => {
            return OrderItem.create({
                ...item,
                orderId: order.id,
            });
        });
        for (const orderItem of orderItens) {
            const product = await this.productRepository.findById(
                orderItem.productId.toString(),
            );
            if (!product) {
                return left(new NotFoundError());
            }
            orderItem.price = product.price * orderItem.quantity;
        }
        orderList.update(orderItens);
        order.itens = orderList;
        order.total = orderList
            .getItems()
            .reduce((total, item) => total + item.price, 0);
        await this.orderRepository.save(order);

        return right({
            order,
        });
    }
}

