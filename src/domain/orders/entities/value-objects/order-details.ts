import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { OrderItemDetails } from "./order-item-details";

export interface OrderDetailsProps {
    userId: UniqueEntityID;
    itens: OrderItemDetails[];
    status: string;
    total: number;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class OrderDetails extends AggregateRoot<OrderDetailsProps> {
    get itens() {
        return this.props.itens;
    }

    set itens(value: OrderItemDetails[]) {
        this.props.itens = value;
        this.touch();
    }

    get userId() {
        return this.props.userId;
    }

    get status() {
        return this.props.status;
    }

    set status(value: string) {
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

    static create(props: OrderDetailsProps, id?: UniqueEntityID) {
        const orderDetails = new OrderDetails(props, id);
        return orderDetails;
    }
}

