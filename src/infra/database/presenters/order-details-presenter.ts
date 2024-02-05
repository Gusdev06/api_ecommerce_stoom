import { OrderDetails } from "@/domain/orders/entities/value-objects/order-details";

export class OrdersDetailsPresenter {
    static toHTTP(ordersDetails: OrderDetails) {
        return {
            orderId: ordersDetails.orderId.toString(),
            itens: ordersDetails.itens.map((item) => ({
                product: {
                    cod: item.product.id,
                    name: item.product.name,
                    description: item.product.description,
                    price: item.product.price,
                },
                quantity: item.quantity,
            })),
            customer: {
                id: ordersDetails.user.id.toString(),
                name: ordersDetails.user.name,
                email: ordersDetails.user.email,
            },
            status: ordersDetails.status,
            total: ordersDetails.total,
            createdAt: ordersDetails.createdAt,
            updatedAt: ordersDetails.updatedAt,
        };
    }
}

