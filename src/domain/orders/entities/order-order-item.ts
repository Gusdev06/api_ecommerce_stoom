import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface OrderOrderitemProps {
    orderId: UniqueEntityID;
    orderItensIds: UniqueEntityID;
}

export class OrderOrderitem extends Entity<OrderOrderitemProps> {
    private constructor(props: OrderOrderitemProps, id?: UniqueEntityID) {
        super(props, id);
    }

    get orderId() {
        return this.props.orderId;
    }

    get orderItensIds() {
        return this.props.orderItensIds;
    }

    static create(props: OrderOrderitemProps, id?: UniqueEntityID) {
        const orderOrderitem = new OrderOrderitem(props, id);
        return orderOrderitem;
    }
}

