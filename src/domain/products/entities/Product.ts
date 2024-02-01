import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface ProductProps {
    name: string;
    description: string;
    price: number;
    inStock: number;
}

export class Product extends Entity<ProductProps> {
    get name() {
        return this.props.name;
    }

    set name(name: string) {
        this.props.name = name;
    }
    get description() {
        return this.props.description;
    }

    set description(description: string) {
        this.props.description = description;
    }

    get price() {
        return this.props.price;
    }

    set price(price: number) {
        this.props.price = price;
    }

    get inStock() {
        return this.props.inStock;
    }

    set inStock(inStock: number) {
        this.props.inStock = inStock;
    }

    static create(props: ProductProps, id?: UniqueEntityID) {
        const product = new Product(props, id);

        return product;
    }
}

