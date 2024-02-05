import { InMemoryOrderItemRepository } from "@/test/in-memory-order-item-repository";
import { InMemoryOrderRepository } from "@/test/in-memory-order-repository";

import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Status } from "../entities/order";
import { OrderDetails } from "../entities/value-objects/order-details";
import { ListOrdersUseCase } from "./fetch-orders";

let inMemoryOrderRepository: InMemoryOrderRepository;
let inMemoryOrderItemRepository: InMemoryOrderItemRepository;
let sut: ListOrdersUseCase;

describe("List Orders Use Case", () => {
    beforeEach(() => {
        inMemoryOrderItemRepository = new InMemoryOrderItemRepository();
        inMemoryOrderRepository = new InMemoryOrderRepository(
            inMemoryOrderItemRepository,
        );
        sut = new ListOrdersUseCase(
            inMemoryOrderRepository,
            { generate: jest.fn(() => 0) },
            { generate: jest.fn(() => 1) },
        );
    });

    it("should list orders with pagination information", async () => {
        inMemoryOrderRepository.itemsDetails = [
            OrderDetails.create({
                orderId: new UniqueEntityID("1"),
                itens: [
                    {
                        quantity: 1,
                        price: 10,
                        product: {
                            id: "1",
                            name: "Order",
                            description: "Order",
                            price: 10,
                        },
                    },
                ],
                user: {
                    id: new UniqueEntityID("1"),
                    name: "User",
                    email: "",
                },
                status: Status.NEW_ORDER,
                total: 0,
                createdAt: new Date(),
            }),
        ];

        const params = {
            search: "Order",
            limit: 10,
            page: 1,
        };

        const result = await sut.execute(params);
        expect(result.isRight()).toBe(true);
    });
});

