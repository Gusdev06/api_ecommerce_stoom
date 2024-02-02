import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@prisma/client/runtime/library";
import { OrderOrderitemList } from "./order-order-item-list";

export interface OrderProps {
    userId: UniqueEntityID;
    itens: OrderOrderitemList;
    status?: string;
    total?: number;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
    get itens() {
        return this.props.itens;
    }

    set itens(value: OrderOrderitemList) {
        this.props.itens = value;
        this.touch();
    }

    get userId() {
        return this.props.userId;
    }

    get status() {
        return this.props.status;
    }

    set status(value: string | undefined) {
        this.props.status = value;
        this.touch();
    }

    get total() {
        return this.props.total;
    }

    set total(value: number | undefined) {
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

    static create(
        props: Optional<OrderProps, "itens" | "status" | "createdAt" | "total">,
        id?: UniqueEntityID,
    ) {
        const order = new Order(
            {
                ...props,
                itens: props.itens ?? new OrderOrderitemList(),
                status: "new order",
                total: 0,
                createdAt: new Date(),
            },
            id,
        );
        return order;
    }
}

