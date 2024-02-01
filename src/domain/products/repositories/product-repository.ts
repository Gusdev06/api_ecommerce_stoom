import { Product } from "../entities/Product";

export interface IListProductsResponse {
    products: Product[];
    count: number;
}

export interface IListProductsRequest {
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

export abstract class ProductRepository {
    abstract findById(id: string): Promise<Product | null>;
    abstract list({
        search,
        limit,
        offset,
    }: IListProductsRequest): Promise<IListProductsResponse | null>;
    // abstract save(product: Product): Promise<void>;
    abstract create(product: Product): Promise<void>;
    // abstract delete(product: Product): Promise<void>;
}
