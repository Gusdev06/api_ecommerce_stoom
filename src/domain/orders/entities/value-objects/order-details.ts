import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-obeject";

export interface IOrderDetailsProps {
    quantity: number;
    price: number;
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
    };
}

export interface IUserProps {
    id: UniqueEntityID;
    name: string;
    email: string;
}

export interface OrderDetailsProps {
    orderId: UniqueEntityID;
    itens: IOrderDetailsProps[];
    user: IUserProps;
    status: string;
    total: number;
    adress: string;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
    get itens() {
        return this.props.itens;
    }

    get status() {
        return this.props.status;
    }

    get adress() {
        return this.props.adress;
    }
    get user() {
        return this.props.user;
    }
    get orderId() {
        return this.props.orderId;
    }

    get total() {
        return this.props.total;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(props: OrderDetailsProps) {
        return new OrderDetails(props);
    }
}

