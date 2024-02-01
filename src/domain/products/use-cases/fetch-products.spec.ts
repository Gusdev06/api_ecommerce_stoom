import { IPaginationResponse } from "@/core/pagination/interfaces/IPaginationResponse";
import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { Product } from "../entities/Product";
import { ListProductsUseCase } from "./fetch-products";

let inMemoryProductRepository: InMemoryProductRepository;
let sut: ListProductsUseCase;

describe("List Products Use Case", () => {
    beforeEach(() => {
        inMemoryProductRepository = new InMemoryProductRepository();
        sut = new ListProductsUseCase(
            inMemoryProductRepository,
            { generate: jest.fn(() => 0) },
            { generate: jest.fn(() => 1) },
        );
    });

    it("should list products with pagination information", async () => {
        inMemoryProductRepository.items = [
            Product.create({
                name: "Product 1",
                description: "Product 1",
                price: 100,
                inStock: 10,
            }),
            Product.create({
                name: "Product 2",
                description: "Product 2",
                price: 200,
                inStock: 20,
            }),
        ];

        const params = {
            search: "Product",
            limit: 10,
            page: 1,
        };

        const result = await sut.execute(params);

        expect(result.isRight()).toBe(true);
        const paginationResponse = result.value as IPaginationResponse<Product>;
        expect(paginationResponse.result).toHaveLength(2);
        expect(paginationResponse.totalRegisters).toBe(2);
        expect(paginationResponse.totalPages).toBe(1);
        expect(paginationResponse.currentPage).toBe(1);

        expect(paginationResponse.result).toHaveLength(2);
    });
});

