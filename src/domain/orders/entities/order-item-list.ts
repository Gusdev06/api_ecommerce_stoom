import { WatchedList } from "@/core/entities/watched-list";
import { OrderItem } from "./order-item";

export class OrderitemList extends WatchedList<OrderItem> {
    public compareItems(a: OrderItem, b: OrderItem): boolean {
        return a.id === b.id;
    }
}

