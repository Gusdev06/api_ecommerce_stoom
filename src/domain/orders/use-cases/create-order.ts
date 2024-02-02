import { Either, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { IUseCase } from "@/core/protocols/IUseCase";
import { Order } from "../entities/order";
import { OrderOrderitem } from "../entities/order-order-item";
import { OrderOrderitemList } from "../entities/order-order-item-list";
import { OrderRepository } from "../repositories/order-repository";

export interface ICreateOrderDTO {
    userId: string;
    orderItensIds: string[];
}

type CreateOrderUseCaseResponse = Either<
    null,
    {
        order: Order;
    }
>;
export class CreateOrderUseCase
    implements IUseCase<ICreateOrderDTO, CreateOrderUseCaseResponse>
{
    constructor(private readonly orderRepository: OrderRepository) {}

    async execute({
        userId,
        orderItensIds,
    }: ICreateOrderDTO): Promise<CreateOrderUseCaseResponse> {
        const order = Order.create({
            userId: new UniqueEntityID(userId),
            updatedAt: new Date(),
        });
        const orderOrderItens = orderItensIds.map((orderItemId) => {
            return OrderOrderitem.create({
                orderItemId: new UniqueEntityID(orderItemId),
                orderId: order.id,
            });
        });

        order.itens = new OrderOrderitemList(orderOrderItens);

        await this.orderRepository.create(order);

        return right({
            order,
        });
    }
}

// import { UniqueEntityID } from "@/core/entities/unique-entity-id";
// import { IUseCase } from "@/core/protocols/IUseCase";
// import { ProductRepository } from "@/domain/products/repositories/product-repository";
// import { Order } from "../entities/Order";
// import { OrderItem } from "../entities/Order-item";
// import { OrderRepository } from "../repositories/order-repository";

// export interface ICreateOrderDTO {
//     userId: string;
//     itens: OrderItem[];
// }

// type CreateOrderUseCaseResponse = Either<
//     null,
//     {
//         order: Order;
//     }
// >;
// export class CreateOrderUseCase
//     implements IUseCase<ICreateOrderDTO, CreateOrderUseCaseResponse>
// {
//     constructor(
//         private readonly orderRepository: OrderRepository,
//         private productRepository: ProductRepository,
//     ) {}

//     async execute({
//         userId,
//         itens,
//     }: ICreateOrderDTO): Promise<CreateOrderUseCaseResponse> {
//         const order = Order.create({
//             userId: new UniqueEntityID(userId),
//             itens,
//             updatedAt: new Date(),
//         });

//         for (const item of itens) {
//             try {
//                 const product = await this.productRepository.findById(
//                     item.productId,
//                 );

//                 if (product) {
//                     item.calculatePrice(product.price);
//                 }

//                 const orderItem = OrderItem.create({
//                     productId: item.productId,
//                     quantity: item.quantity,
//                     price: item.price,
//                     createdAt: new Date(),
//                 });

//                 order.addItem(item);
//             } catch (error) {
//                 return left(null);
//             }
//         }

//         await this.orderRepository.create(order);

//         return right({
//             order,
//         });
//     }
// }

