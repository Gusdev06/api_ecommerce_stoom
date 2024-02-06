import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

import { Optional } from "@/core/types/optional";
import { OrderItem } from "./order-item";
import { OrderitemList } from "./order-item-list";

export enum Status {
    NEW_ORDER = "NEW_ORDER",
    PROCESSING_ORDER = "PROCESSING_ORDER",
    DISPATCHED_ORDER = "DISPATCHED_ORDER",
    DELIVERED_ORDER = "DELIVERED_ORDER",
}
export interface OrderProps {
    userId: UniqueEntityID;
    itens: OrderitemList;
    status: Status;
    total: number;
    adress: string;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
    get itens() {
        return this.props.itens;
    }

    set itens(value: OrderitemList) {
        this.props.itens = value;
        this.touch();
    }

    get adress() {
        return this.props.adress;
    }

    set adress(value: string) {
        this.props.adress = value;
        this.touch();
    }
    get userId() {
        return this.props.userId;
    }

    get status() {
        return this.props.status;
    }

    set status(value: Status) {
        this.props.status = value;
        this.touch();
    }

    get total() {
        return this.props.total;
    }

    set total(value: number) {
        this.props.total = value;
        this.touch();
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    private touch() {
        this.props.updatedAt = new Date();
    }

    addItem(item: OrderItem): void {
        this.props.itens.add(item);
    }

    removeItem(productId: UniqueEntityID): void {
        const item = this.props.itens.getItems().find((item) => {
            return item.productId === productId;
        });

        if (item) {
            this.props.itens.remove(item);
        }
    }

    calculateTotal(): number {
        let total = 0;
        this.props.itens.getItems().forEach((item) => {
            total += item.calculateTotal();
        });
        return total;
    }

    static create(
        props: Optional<
            OrderProps,
            "itens" | "status" | "createdAt" | "total" | "updatedAt"
        >,
        id?: UniqueEntityID,
    ) {
        const order = new Order(
            {
                ...props,
                itens: props.itens ?? new OrderitemList(),
                status: props.status ?? Status.NEW_ORDER,
                total: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id,
        );
        return order;
    }
}

