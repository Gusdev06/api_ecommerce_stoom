import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IUseCase } from "@/core/protocols/IUseCase";

import { Either, left, right } from "@/core/either";
import { ProductRepository } from "@/domain/products/repositories/product-repository";
import { Order } from "../entities/order";
import { OrderItem, OrderItemProps } from "../entities/order-item";
import { NotFoundError } from "../errors/not-found-error";
import { OrderRepository } from "../repositories/order-repository";

export interface ICreateOrderDTO {
    userId: string;
    itens: OrderItemProps[];
}

type CreateOrderUseCaseResponse = Either<
    NotFoundError,
    {
        order: Order;
    }
>;
export class CreateOrderUseCase
    implements IUseCase<ICreateOrderDTO, CreateOrderUseCaseResponse>
{
    constructor(
        private readonly orderRepository: OrderRepository,
        private readonly productRepository: ProductRepository,
    ) {}

    async execute({
        userId,
        itens,
    }: ICreateOrderDTO): Promise<CreateOrderUseCaseResponse> {
        const order = Order.create({
            userId: new UniqueEntityID(userId),
        });

        for (const item of itens) {
            const product = await this.productRepository.findById(
                item.productId.toString(),
            );

            if (!product) {
                return left(new NotFoundError());
            }

            const orderItem = OrderItem.create({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                orderId: order.id,
                createdAt: new Date(),
            });

            order.addItem(orderItem);
        }

        const total = order.calculateTotal();
        order.total = total;

        await this.orderRepository.create(order);

        return right({
            order,
        });
    }
}

