import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface OrderItemProps {
    id?: UniqueEntityID;
    productId: UniqueEntityID;
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

    get price() {
        return this.props.price !== undefined ? this.props.price : 0;
    }

    set price(value: number) {
        this.props.price = value;
        this.touch();
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

    public calculatePrice(productPrice: number) {
        this.price = productPrice * this.quantity;
    }

    static create(props: OrderItemProps, id?: UniqueEntityID) {
        const orderItem = new OrderItem(props, id);
        return orderItem;
    }
}

