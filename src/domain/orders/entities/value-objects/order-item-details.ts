import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ProductDetails } from "@/domain/products/entities/value-objects/product-details";

export interface OrderItemDetailsProps {
    product: ProductDetails[];
    quantity: number;
    price: number;
    createdAt: Date;
    updatedAt?: Date;
}

export class OrderItemDetails extends Entity<OrderItemDetailsProps> {
    private touch() {
        this.props.updatedAt = new Date();
    }

    get quantity() {
        return this.props.quantity;
    }

    get product() {
        return this.props.product;
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

    set quantity(value: number) {
        this.props.quantity = value;
        this.touch();
    }

    static create(props: OrderItemDetailsProps, id?: UniqueEntityID) {
        const orderItemDetails = new OrderItemDetails(props, id);
        return orderItemDetails;
    }
}

