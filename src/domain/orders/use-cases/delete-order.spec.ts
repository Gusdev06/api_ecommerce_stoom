import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrder } from "@/test/factories/make-order";

import { makeOrderitem } from "@/test/factories/make-order-item";
import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { DeleteOrderUseCase } from "./delete-order";

let inMemoryOrdersRepository: InMemoryOrderRepository;
let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let sut: DeleteOrderUseCase;

describe("Delete Order", () => {
    beforeEach(() => {
        inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
        inMemoryOrdersRepository = new InMemoryOrderRepository(
            inMemoryOrderItemRepository,
        );
        sut = new DeleteOrderUseCase(inMemoryOrdersRepository);
    });

    it("should be able to delete a order by id", async () => {
        const newOrder = makeOrder({}, new UniqueEntityID("1"));

        await inMemoryOrdersRepository.create(newOrder);

        inMemoryOrderItemRepository.items.push(
            makeOrderitem({ orderId: newOrder.id }),
        );

        const result = await sut.execute({
            id: "1",
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryOrdersRepository.items).toHaveLength(0);
    });
});

