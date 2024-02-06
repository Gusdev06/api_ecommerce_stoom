import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeProduct } from "@/test/factories/make-product";
import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { ProductOutOfStockError } from "../errors/product-out-of-stock";
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
            adress: "Rua 123",
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
        expect(inMemoryOrderItemRepository.items).toHaveLength(2);
    });

    it("should persist orderItens when creating a new order", async () => {
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
            adress: "Rua 123",
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
        expect(result.isRight()).toBeTruthy();
        expect(inMemoryOrderItemRepository.items).toHaveLength(2);
        expect(inMemoryOrderItemRepository.items[0].productId.toValue()).toBe(
            "1",
        );
        expect(inMemoryOrderItemRepository.items[1].productId.toValue()).toBe(
            "2",
        );
        expect(inMemoryOrderItemRepository.items[0].orderId.toValue()).toBe(
            inMemoryOrderRepository.items[0].id.toValue(),
        );
        expect(inMemoryOrderItemRepository.items[1].orderId.toValue()).toBe(
            inMemoryOrderRepository.items[0].id.toValue(),
        );
    });

    it("should be not able to create a order with quantity greater than the stock", async () => {
        const newProduct = makeProduct(
            {
                price: 25.0,
                inStock: 3,
            },
            new UniqueEntityID("1"),
        );
        const newProduct2 = makeProduct(
            {
                price: 30.0,
                inStock: 2,
            },
            new UniqueEntityID("2"),
        );
        await inMemoryProductRepository.create(newProduct);
        await inMemoryProductRepository.create(newProduct2);
        const result = await sut.execute({
            userId: "user123",
            adress: "Rua 123",
            itens: [
                {
                    productId: newProduct.id,
                    quantity: 4,
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
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(ProductOutOfStockError);
    });

    it("should be able to update product stock when creating a new order", async () => {
        const newProduct = makeProduct(
            {
                price: 25.0,
                inStock: 3,
            },
            new UniqueEntityID("1"),
        );
        const newProduct2 = makeProduct(
            {
                price: 30.0,
                inStock: 2,
            },
            new UniqueEntityID("2"),
        );
        await inMemoryProductRepository.create(newProduct);
        await inMemoryProductRepository.create(newProduct2);
        await sut.execute({
            userId: "user123",
            adress: "Rua 123",
            itens: [
                {
                    productId: newProduct.id,
                    quantity: 1,
                    orderId: new UniqueEntityID("1"),
                    price: newProduct.price,
                    createdAt: new Date(),
                },
                {
                    productId: newProduct2.id,
                    quantity: 1,
                    orderId: new UniqueEntityID("2"),
                    price: newProduct2.price,
                    createdAt: new Date(),
                },
            ],
        });
        const updatedProduct = await inMemoryProductRepository.findById(
            newProduct.id.toValue(),
        );
        const updatedProduct2 = await inMemoryProductRepository.findById(
            newProduct2.id.toValue(),
        );
        expect(updatedProduct?.inStock).toBe(2);
        expect(updatedProduct2?.inStock).toBe(1);
    });
});

