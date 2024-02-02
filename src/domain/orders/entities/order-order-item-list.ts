import { WatchedList } from "@/core/entities/watched-list";
import { OrderOrderitem } from "./order-order-item";

export class OrderOrderitemList extends WatchedList<OrderOrderitem> {
    public compareItems(a: OrderOrderitem, b: OrderOrderitem): boolean {
        return a.orderItemId === b.orderItemId;
    }
}

