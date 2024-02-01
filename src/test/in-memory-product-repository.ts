import { Product } from "@/domain/products/entities/Product";
import {
    IListProductsRequest,
    IListProductsResponse,
    ProductRepository,
} from "@/domain/products/repositories/product-repository";

export class InMemoryProductRepository implements ProductRepository {
    public items: Product[] = [];

    async findById(id: string): Promise<Product | null> {
        const product = this.items.find(
            (product) => product.id.toString() === id,
        );

        return product || null;
    }

    async save(product: Product): Promise<void> {
        const index = this.items.findIndex((p) => p.id.equals(product.id));

        this.items[index] = product;
    }

    async create(product: Product): Promise<void> {
        this.items.push(product);
    }

    async delete(product: Product): Promise<void> {
        this.items = this.items.filter((p) => !p.id.equals(product.id));
    }

    async list({
        search,
        limit,
        offset,
    }: IListProductsRequest): Promise<IListProductsResponse> {
        let filteredProducts = this.items;

        if (search) {
            filteredProducts = this.items.filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase()),
            );
        }

        const startIndex = offset || 0;
        const endIndex = startIndex + (limit || this.items.length);
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        return {
            products: paginatedProducts,
            count: this.items.length,
        };
    }
}

