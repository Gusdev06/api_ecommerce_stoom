import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeProduct } from "@/test/factories/make-product";
import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { InMemoryProductRepository } from "./../../../test/in-memory-product-repository";
import { CreateOrderUseCase } from "./create-order";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let inMemoryProductRepository: InMemoryProductRepository;

let sut: CreateOrderUseCase;

describe("Create Order Use Case", () => {
    beforeEach(() => {
        inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
        inMemoryOrderRepository = new InMemoryOrderRepository(
            inMemoryOrderItemRepository,
        );
        inMemoryProductRepository = new InMemoryProductRepository();
        sut = new CreateOrderUseCase(
            inMemoryOrderRepository,
            inMemoryProductRepository,
        );
    });

    it("should be able to create a new order", async () => {
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
        await inMemoryProductRepository.create(newProduct);
        await inMemoryProductRepository.create(newProduct2);
        const result = await sut.execute({
            userId: "user123",
            itens: [
                {
                    productId: newProduct.id,
                    quantity: 2,
                    orderId: new UniqueEntityID("1"),
                    price: newProduct.price,
                    createdAt: new Date(),
                },
                {
                    productId: newProduct2.id,
                    quantity: 3,
                    orderId: new UniqueEntityID("2"),
                    price: newProduct2.price,
                    createdAt: new Date(),
                },
            ],
        });
        expect(result.isRight()).toBe(true);
        expect(
            inMemoryOrderRepository.items[0].itens.currentItems[0].productId.toValue(),
        ).toBe("1");
        expect(
            inMemoryOrderRepository.items[0].itens.currentItems[1].productId.toValue(),
        ).toBe("2");
        expect(inMemoryOrderRepository.items[0].total).toBe(140);
    });

    it("should persist orderItens when creating a new order", async () => {
        const result = await sut.execute({
            userId: "user123",
            itens: [
                {
                    productId: new UniqueEntityID("1"),
                    quantity: 2,
                    price: 25.0,
                    createdAt: new Date(),
                    orderId: new UniqueEntityID("1"),
                },
                {
                    productId: new UniqueEntityID("2"),
                    quantity: 3,
                    price: 30.0,
                    createdAt: new Date(),
                    orderId: new UniqueEntityID("1"),
                },
            ],
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryOrderItemRepository.items).toHaveLength(2);
    });

    it("should orderId in orderIten be the same as the order created", async () => {
        const result = await sut.execute({
            userId: "user123",
            itens: [
                {
                    productId: new UniqueEntityID("1"),
                    quantity: 2,
                    price: 25.0,
                    createdAt: new Date(),
                    orderId: new UniqueEntityID("1"),
                },
                {
                    productId: new UniqueEntityID("2"),
                    quantity: 3,
                    price: 30.0,
                    createdAt: new Date(),
                    orderId: new UniqueEntityID("1"),
                },
            ],
        });
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryOrderItemRepository.items[0].orderId.toValue()).toBe(
            inMemoryOrderRepository.items[0].id.toValue(),
        );
        expect(inMemoryOrderItemRepository.items[1].orderId.toValue()).toBe(
            inMemoryOrderRepository.items[0].id.toValue(),
        );
    });
});

