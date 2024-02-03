import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { makeOrder } from "@/test/factories/make-order";
import { makeOrderOrderItem } from "@/test/factories/make-order-order-item";
import { InMemoryOrderOrderItemRepository } from "@/test/in-memory-order-order-item.repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";
import { EditOrderUseCase } from "./edit-order";

let inMemoryOrdersRepository: InMemoryOrderRepository;
let inMemoryOrderOrderItemRepository: InMemoryOrderOrderItemRepository;
let sut: EditOrderUseCase;

describe("Edit Order", () => {
    beforeEach(() => {
        inMemoryOrderOrderItemRepository =
            new InMemoryOrderOrderItemRepository();
        inMemoryOrdersRepository = new InMemoryOrderRepository(
            inMemoryOrderOrderItemRepository,
        );
        sut = new EditOrderUseCase(
            inMemoryOrdersRepository,
            inMemoryOrderOrderItemRepository,
        );
    });

    it("should edit an order", async () => {
        const existingOrder = makeOrder();
        inMemoryOrdersRepository.create(existingOrder);

        inMemoryOrderOrderItemRepository.items.push(
            makeOrderOrderItem({
                orderId: existingOrder.id,
                orderItensIds: new UniqueEntityID("1"),
            }),
        );

        await sut.execute({
            id: existingOrder.id.toValue(),
            orderItensIds: ["1", "3"],
            status: "completed",
        });

        expect(
            inMemoryOrdersRepository.items[0].itens.currentItems,
        ).toHaveLength(2);
        expect(inMemoryOrdersRepository.items[0].itens.currentItems).toEqual([
            expect.objectContaining({ orderItensIds: new UniqueEntityID("1") }),
            expect.objectContaining({ orderItensIds: new UniqueEntityID("3") }),
        ]);
    });

    it("should sync new and removed orderItens when editing an order", async () => {
        const existingOrder = makeOrder();
        inMemoryOrdersRepository.create(existingOrder);

        inMemoryOrderOrderItemRepository.items.push(
            makeOrderOrderItem({
                orderId: existingOrder.id,
                orderItensIds: new UniqueEntityID("1"),
            }),
            makeOrderOrderItem({
                orderId: existingOrder.id,
                orderItensIds: new UniqueEntityID("2"),
            }),
        );

        const result = await sut.execute({
            id: existingOrder.id.toValue(),
            orderItensIds: ["1", "3"],
            status: "completed",
        });

        expect(result.isRight()).toBeTruthy();
        expect(inMemoryOrderOrderItemRepository.items).toHaveLength(2);
        expect(inMemoryOrderOrderItemRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    orderItensIds: new UniqueEntityID("1"),
                }),
                expect.objectContaining({
                    orderItensIds: new UniqueEntityID("3"),
                }),
            ]),
        );
    });
});

