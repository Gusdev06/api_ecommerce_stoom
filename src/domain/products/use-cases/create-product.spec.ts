import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { CreateProductUseCase } from "./create-product";

let inMemoryProductRepository: InMemoryProductRepository;
let sut: CreateProductUseCase;

describe("Create Product Use Case", () => {
    beforeEach(() => {
        inMemoryProductRepository = new InMemoryProductRepository();
        sut = new CreateProductUseCase(inMemoryProductRepository);
    });

    it("should be able to create a new product", async () => {
        const productData = {
            name: "Product Name",
            description: "Product Description",
            price: 100,
            inStock: 10,
        };

        const result = await sut.execute(productData);

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            product: inMemoryProductRepository.items[0],
        });

        const createdProduct = inMemoryProductRepository.items[0];
        expect(createdProduct.name).toBe(productData.name);
        expect(createdProduct.description).toBe(productData.description);
        expect(createdProduct.inStock).toBe(productData.inStock);
        expect(createdProduct.price).toBe(productData.price);
    });

    it("should not be able to create a new product with negative inStock", async () => {
        const productData = {
            name: "Product Name",
            description: "Product Description",
            price: 100,
            inStock: 0,
        };

        const result = await sut.execute(productData);

        expect(result.isLeft()).toBe(true);
    });
});

