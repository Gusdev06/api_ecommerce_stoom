import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeProduct } from "@/test/factories/make-product";
import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { GetProductUseCase } from "./get-product-by-id";

let inMemoryProductRepository: InMemoryProductRepository;
let sut: GetProductUseCase;

describe("List Products Use Case", () => {
    beforeEach(() => {
        inMemoryProductRepository = new InMemoryProductRepository();
        sut = new GetProductUseCase(inMemoryProductRepository);
    });

    it("should get product with id", async () => {
        const product = makeProduct({}, new UniqueEntityID("1"));
        await inMemoryProductRepository.create(product);

        const result = await sut.execute({ id: "1" });

        expect(result.isRight()).toBe(true);
    });
});

