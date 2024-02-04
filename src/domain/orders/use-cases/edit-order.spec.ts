import { makeOrder } from "@/test/factories/make-order";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrderitem } from "@/test/factories/make-order-item";
import { makeProduct } from "@/test/factories/make-product";
import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { EditOrderUseCase } from "./edit-order";

let inMemoryOrdersRepository: InMemoryOrderRepository;
let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let inMemoryProductRepository: InMemoryProductRepository;
let sut: EditOrderUseCase;

describe("Edit Order", () => {
    beforeEach(() => {
        inMemoryProductRepository = new InMemoryProductRepository();
        inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
        inMemoryOrdersRepository = new InMemoryOrderRepository(
            inMemoryOrderItemRepository,
        );
        sut = new EditOrderUseCase(
            inMemoryOrdersRepository,
            inMemoryOrderItemRepository,
        );
    });

    it("should edit an order", async () => {
        const existingOrder = makeOrder({
            status: "pending",
            total: 0,
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
                price: 11,
            }),
            makeOrderitem({
                orderId: existingOrder.id,
                productId: newProduct2.id,
                price: 12,
            }),
        );
        console.log(inMemoryOrderItemRepository.items);
        const result = await sut.execute({
            id: existingOrder.id.toString(),
            status: "completed",
            itens: [
                makeOrderitem({
                    orderId: existingOrder.id,
                    productId: newProduct3.id,
                    price: 13,
                }),
            ],
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryOrderItemRepository.items).toHaveLength(1);
    });

    it("should sync new and removed itens when editing an order", async () => {
        const existingOrder = makeOrder({
            status: "pending",
            total: 0,
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
                price: 11,
            }),
            makeOrderitem({
                orderId: existingOrder.id,
                productId: newProduct2.id,
                price: 12,
            }),
        );

        const result = await sut.execute({
            id: existingOrder.id.toString(),
            status: "completed",
            itens: [
                makeOrderitem({
                    orderId: existingOrder.id,
                    productId: newProduct3.id,
                    price: 13,
                }),
            ],
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryOrderItemRepository.items).toHaveLength(1);
    });
});

