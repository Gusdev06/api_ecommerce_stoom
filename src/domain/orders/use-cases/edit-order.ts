import { Either, left, right } from "@/core/either";
import { OrderItemRepository } from "@/domain/orders/repositories/order-item-repository";
import { ProductRepository } from "@/domain/products/repositories/product-repository";

import { IUseCase } from "@/core/protocols/IUseCase";

import { Order } from "../entities/order";
import { OrderItem, OrderItemProps } from "../entities/order-item";
import { OrderitemList } from "../entities/order-item-list";
import { NotFoundError } from "../errors/not-found-error";
import { ProductOutOfStockError } from "../errors/product-out-of-stock";
import { QuantityError } from "../errors/quantity-error";
import { OrderRepository } from "../repositories/order-repository";

interface EditOrderUseCaseRequest {
    id: string;

    itens: OrderItemProps[];
}

type EditOrderUseCaseResponse = Either<
    NotFoundError | QuantityError | ProductOutOfStockError,
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

        const orderItens = await Promise.all(
            itens.map(async (item) => {
                const product = await this.productRepository.findById(
                    item.productId.toString(),
                );

                if (item.quantity < 1) {
                    throw new QuantityError();
                }

                if (product) {
                    if (product.inStock < item.quantity) {
                        throw new ProductOutOfStockError();
                    }
                    product.inStock = product.inStock - item.quantity;
                    await this.productRepository.save(product);
                }

                return OrderItem.create({
                    ...item,
                    orderId: order.id,
                    price: product!.price,
                });
            }),
        );

        orderList.update(orderItens);
        order.itens = orderList;
        order.total = order.calculateTotal();
        await this.orderRepository.save(order);

        return right({
            order,
        });
    }
}

