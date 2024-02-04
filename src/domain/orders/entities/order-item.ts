import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface OrderItemProps {
    id?: UniqueEntityID;
    productId: UniqueEntityID;
    orderId: UniqueEntityID;
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt?: Date;
}

export class OrderItem extends Entity<OrderItemProps> {
    private touch() {
        this.props.updatedAt = new Date();
    }

    get quantity() {
        return this.props.quantity;
    }

    get orderId() {
        return this.props.orderId;
    }

    get price() {
        return this.props.price !== undefined ? this.props.price : 0;
    }

    set price(value: number) {
        this.props.price = value;
        this.touch();
    }

    calculateTotal(): number {
        return this.props.price * this.props.quantity;
    }
    get createdAt() {
        return this.props.createdAt;
    }

    get updateAt() {
        return this.props.createdAt;
    }

    get productId() {
        return this.props.productId;
    }

    set quantity(value: number) {
        this.props.quantity = value;
        this.touch();
    }

    static create(
        props: Optional<OrderItemProps, "createdAt" | "updatedAt">,
        id?: UniqueEntityID,
    ) {
        const orderItem = new OrderItem(
            {
                ...props,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            id,
        );
        return orderItem;
    }
}

