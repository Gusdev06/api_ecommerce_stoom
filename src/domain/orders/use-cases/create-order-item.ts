import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IUseCase } from "@/core/protocols/IUseCase";
import { ProductRepository } from "@/domain/products/repositories/product-repository";
import { OrderItem } from "../entities/order-item";
import { NotFoundError } from "../errors/not-found-error";
import { ProductOutOfStockError } from "../errors/product-out-of-stock";
import { QuantityError } from "../errors/quantity-error";
import { OrderItemRepository } from "../repositories/order-item-repository";

export interface ICreateOrderItemDTO {
    productId: string;
    quantity: number;
}

type CreateOrderItemUseCaseResponse = Either<
    QuantityError | NotFoundError,
    {
        orderitem: OrderItem;
    }
>;
export class CreateOrderItemUseCase
    implements IUseCase<ICreateOrderItemDTO, CreateOrderItemUseCaseResponse>
{
    constructor(
        private readonly orderitemRepository: OrderItemRepository,
        private readonly productRepository: ProductRepository,
    ) {}

    async execute({
        productId,
        quantity,
    }: ICreateOrderItemDTO): Promise<CreateOrderItemUseCaseResponse> {
        const products = await this.productRepository.findById(productId);

        if (!products) {
            return left(new NotFoundError());
        }

        if (quantity < 1) {
            return left(new QuantityError());
        }

        if (quantity > products.inStock) {
            return left(new ProductOutOfStockError());
        }

        const orderitem = OrderItem.create({
            productId: new UniqueEntityID(productId),
            quantity,
            price: products.price * quantity,
            createdAt: new Date(),
        });

        await this.orderitemRepository.create(orderitem);

        return right({ orderitem });
    }
}

