import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ValueObject } from "@/core/entities/value-obeject";

export interface ProductDetailsProps {
    productId: UniqueEntityID;
    name: string;
    description: string;
    price: number;
    inStock: number;
}

export class ProductDetails extends ValueObject<ProductDetailsProps> {
    get name() {
        return this.props.name;
    }

    set name(name: string) {
        this.props.name = name;
    }
    get description() {
        return this.props.description;
    }

    get productId() {
        return this.props.productId;
    }
    set description(description: string) {
        this.props.description = description;
    }

    get price() {
        return this.props.price;
    }

    get inStock() {
        return this.props.inStock;
    }

    static create(props: ProductDetailsProps) {
        const productDetals = new ProductDetails(props);
        return productDetals;
    }
}

