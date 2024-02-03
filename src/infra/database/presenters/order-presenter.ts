import { Order } from "@/domain/orders/entities/order";
import { OrderItemPresenter } from "./order-item-presenter";

export class OrdersPresenter {
    static toHTTP(order: Order) {
        return {
            id: order.id.toString(),
            userId: order.userId.toString(),
            itens: order.itens.currentItems.map(OrderItemPresenter.toHTTP),
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    }
}

