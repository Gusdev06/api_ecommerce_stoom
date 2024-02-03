import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrder } from "@/test/factories/make-order";
import { makeOrderOrderItem } from "@/test/factories/make-order-order-item";
import { InMemoryOrderOrderItemRepository } from "@/test/in-memory-order-order-item.repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { DeleteOrderUseCase } from "./delete-order";

let inMemoryOrdersRepository: InMemoryOrderRepository;
let inMemoryOrderOrderItemRepository: InMemoryOrderOrderItemRepository;
let sut: DeleteOrderUseCase;

describe("Delete Order", () => {
    beforeEach(() => {
        inMemoryOrderOrderItemRepository =
            new InMemoryOrderOrderItemRepository();
        inMemoryOrdersRepository = new InMemoryOrderRepository(
            inMemoryOrderOrderItemRepository,
        );
        sut = new DeleteOrderUseCase(inMemoryOrdersRepository);
    });

    it("should be able to delete a order by id", async () => {
        const newOrder = makeOrder({}, new UniqueEntityID("1"));

        await inMemoryOrdersRepository.create(newOrder);

        inMemoryOrderOrderItemRepository.items.push(
            makeOrderOrderItem({
                orderId: newOrder.id,
                orderItensIds: new UniqueEntityID("1"),
            }),
            makeOrderOrderItem({
                orderId: newOrder.id,
                orderItensIds: new UniqueEntityID("2"),
            }),
        );

        const result = await sut.execute({
            id: "1",
        });

        expect(result.isRight()).toBe(true);
        expect(inMemoryOrdersRepository.items).toHaveLength(0);
        expect(inMemoryOrderOrderItemRepository.items).toHaveLength(0);
    });
});

