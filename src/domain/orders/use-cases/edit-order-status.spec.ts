import { makeOrder } from "@/test/factories/make-order";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrderitem } from "@/test/factories/make-order-item";
import { makeProduct } from "@/test/factories/make-product";
import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { Status } from "../entities/order";
import { EditOrderStatusUseCase } from "./edit-order-status";

let inMemoryOrdersRepository: InMemoryOrderRepository;
let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let inMemoryProductRepository: InMemoryProductRepository;
let sut: EditOrderStatusUseCase;

describe("Edit stuts Order", () => {
    beforeEach(() => {
        inMemoryProductRepository = new InMemoryProductRepository();
        inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
        inMemoryOrdersRepository = new InMemoryOrderRepository(
            inMemoryOrderItemRepository,
        );
        sut = new EditOrderStatusUseCase(inMemoryOrdersRepository);
    });

    it("should edit an order status", async () => {
        const existingOrder = makeOrder({
            total: 0,
            status: Status.NEW_ORDER,
        });
        inMemoryOrdersRepository.create(existingOrder);

        const newProduct = makeProduct(
            {
                price: 25.0,
            },
            new UniqueEntityID("1"),
        );
        const newProduct2 = makeProduct(
            {
                price: 30.0,
            },
            new UniqueEntityID("2"),
        );

        const newProduct3 = makeProduct(
            {
                price: 20.0,
            },
            new UniqueEntityID("2"),
        );
        await inMemoryProductRepository.create(newProduct);
        await inMemoryProductRepository.create(newProduct2);
        await inMemoryProductRepository.create(newProduct3);
        inMemoryOrderItemRepository.items.push(
            makeOrderitem({
                orderId: existingOrder.id,
                productId: newProduct.id,
                price: newProduct.price,
                quantity: 1,
            }),
        );
        inMemoryOrderItemRepository.items.push(
            makeOrderitem({
                orderId: existingOrder.id,
                productId: newProduct2.id,
                price: newProduct2.price,
                quantity: 2,
            }),
        );
        const result = await sut.execute({
            id: existingOrder.id.toString(),
            status: Status.PROCESSING_ORDER,
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryOrdersRepository.items[0].status).toBe(
            "PROCESSING_ORDER",
        );
    });
});

