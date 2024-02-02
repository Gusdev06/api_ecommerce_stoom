import { Order } from "../entities/order";

export interface IListOrdersResponse {
    orders: Order[];
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
    // abstract list({
    //     search,
    //     limit,
    //     offset,
    // }: IListOrdersRequest): Promise<IListOrdersResponse | null>;
    abstract save(order: Order): Promise<void>;
    abstract create(order: Order): Promise<void>;
    abstract delete(order: Order): Promise<void>;
}

