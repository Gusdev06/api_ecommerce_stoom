import { Order } from "../entities/order";
import { OrderDetails } from "../entities/value-objects/order-details";

export interface IListOrdersResponse {
    orders: OrderDetails[];
    count: number;
}

export interface IListOrdersRequest {
    search?: string;
    limit?: number;
    offset?: number;
}

export interface IListUseCaseParams {
    search?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    orderMode?: string;
}

export abstract class OrderRepository {
    abstract findById(id: string): Promise<Order | null>;
    abstract list({
        search,
        limit,
        offset,
    }: IListOrdersRequest): Promise<IListOrdersResponse | null>;
    abstract save(order: Order): Promise<void>;
    abstract updateStatus(order: Order): Promise<void>;
    abstract create(order: Order): Promise<void>;
    abstract delete(order: Order): Promise<void>;
}

