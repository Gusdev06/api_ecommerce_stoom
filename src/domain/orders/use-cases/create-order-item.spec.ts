import { makeProduct } from "@/test/factories/make-product";
import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryProductRepository } from "@/test/in-memory-product-repository";
import { CreateOrderItemUseCase } from "./create-order-item";

let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let inMemoryProductRepository: InMemoryProductRepository;
let sut: CreateOrderItemUseCase;

describe("create orderitem", () => {
    beforeEach(() => {
        inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
        inMemoryProductRepository = new InMemoryProductRepository();

        sut = new CreateOrderItemUseCase(
            inMemoryOrderItemRepository,
            inMemoryProductRepository,
        );
    });

    it("should create a new orderitem", async () => {
        const newProduct = makeProduct({
            price: 34,
        });

        inMemoryProductRepository.create(newProduct);

        const result = await sut.execute({
            productId: newProduct.id.toValue(),
            quantity: 2,
        });

        expect(result.isRight()).toBe(true);
        expect(result.value).toEqual({
            orderitem: inMemoryOrderItemRepository.items[0],
        });
        expect(inMemoryOrderItemRepository.items[0].price).toBe(68);
    });
});

