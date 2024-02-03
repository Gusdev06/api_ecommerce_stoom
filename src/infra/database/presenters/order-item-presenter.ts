import { OrderItem } from "@/domain/orders/entities/order-item";

export class OrderItemPresenter {
    static toHTTP(orderItem: OrderItem) {
        return {
            id: orderItem.id.toString(),
            productId: orderItem.productId.toString(),
            quantity: orderItem.quantity,
            price: orderItem.price,
            createdAt: orderItem.createdAt,
        };
    }
}

