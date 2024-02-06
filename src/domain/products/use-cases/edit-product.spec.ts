import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeProduct } from "@/test/factories/make-product";
import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { EditProductUseCase } from "./edit-product";

let inMemoryProductsRepository: InMemoryProductRepository;

let sut: EditProductUseCase;

describe("Edit Product", () => {
    beforeEach(() => {
        inMemoryProductsRepository = new InMemoryProductRepository();
        sut = new EditProductUseCase(inMemoryProductsRepository);
    });

    it("should be able to edit a product", async () => {
        const newProduct = makeProduct(
            {
                name: "Product 1",
                description: "Product 1",
                price: 100,
                inStock: 10,
            },
            new UniqueEntityID("1"),
        );

        await inMemoryProductsRepository.create(newProduct);

        const result = await sut.execute({
            id: "1",
            name: "Product 2",
            description: "Product 2",
            price: 200,
            inStock: 20,
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryProductsRepository.items[0].name).toBe("Product 2");
        expect(inMemoryProductsRepository.items[0].description).toBe(
            "Product 2",
        );
        expect(inMemoryProductsRepository.items[0].price).toBe(200);
        expect(inMemoryProductsRepository.items[0].inStock).toBe(20);
    });

    it("should be not able to edit a product that does not exist", async () => {
        const result = await sut.execute({
            id: "1",
            name: "Product 2",
            description: "Product 2",
            price: 200,
            inStock: 20,
        });

        expect(result.isLeft()).toBe(true);
    });
});

