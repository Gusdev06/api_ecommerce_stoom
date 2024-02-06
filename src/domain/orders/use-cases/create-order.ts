import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IUseCase } from "@/core/protocols/IUseCase";

import { Either, left, right } from "@/core/either";
import { ProductRepository } from "@/domain/products/repositories/product-repository";
import { Order } from "../entities/order";
import { OrderItem, OrderItemProps } from "../entities/order-item";

import { NotFoundError } from "@/domain/products/errors/not-found-error";
import { ProductOutOfStockError } from "../errors/product-out-of-stock";
import { QuantityError } from "../errors/quantity-error";
import { OrderRepository } from "../repositories/order-repository";

export interface ICreateOrderDTO {
    userId: string;
    itens: OrderItemProps[];
    adress: string;
}

type CreateOrderUseCaseResponse = Either<
    NotFoundError | ProductOutOfStockError | QuantityError,
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
        adress,
    }: ICreateOrderDTO): Promise<CreateOrderUseCaseResponse> {
        const order = Order.create({
            userId: new UniqueEntityID(userId),
            adress,
        });

        for (const item of itens) {
            const product = await this.productRepository.findById(
                item.productId.toString(),
            );

            if (!product) {
                return left(new NotFoundError());
            }

            if (product.inStock < item.quantity) {
                return left(new ProductOutOfStockError());
            }

            if (product) {
                product.inStock = product.inStock - item.quantity;
                await this.productRepository.save(product);
            }

            const orderItem = OrderItem.create({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
                orderId: order.id,
                createdAt: new Date(),
            });

            if (orderItem.quantity < 1) {
                return left(new QuantityError());
            }
            order.itens.add(orderItem);
        }

        const total = order.calculateTotal();
        order.total = total;
        await this.orderRepository.create(order);

        return right({
            order,
        });
    }
}

