import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CreateOrderUseCase } from "./create-order";

import { InMemoryOrderOrderItemRepository } from "@/test/in-memory-order-order-item.repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryOrderOrderItemRepository: InMemoryOrderOrderItemRepository;
let sut: CreateOrderUseCase;

describe("create order", () => {
    beforeEach(() => {
        inMemoryOrderOrderItemRepository =
            new InMemoryOrderOrderItemRepository();
        inMemoryOrderRepository = new InMemoryOrderRepository(
            inMemoryOrderOrderItemRepository,
        );

        sut = new CreateOrderUseCase(inMemoryOrderRepository);
    });

    it("should create a new order", async () => {
        const result = await sut.execute({
            userId: "1",
            orderItensIds: ["1", "2"],
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryOrderRepository.items[0]).toEqual(result.value?.order);
        expect(
            inMemoryOrderRepository.items[0].itens.currentItems,
        ).toHaveLength(2);
        expect(inMemoryOrderRepository.items[0].itens.currentItems).toEqual([
            expect.objectContaining({ orderItensIds: new UniqueEntityID("1") }),
            expect.objectContaining({ orderItensIds: new UniqueEntityID("2") }),
        ]);
    });
});

