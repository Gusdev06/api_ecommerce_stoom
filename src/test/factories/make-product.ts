import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Product, ProductProps } from "@/domain/products/entities/Product";
import { faker } from "@faker-js/faker";

export function makeProduct(
    override: Partial<ProductProps> = {},
    id?: UniqueEntityID,
) {
    const product = Product.create(
        {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.number.int(),
            inStock: faker.number.int(),
            ...override,
        },
        id,
    );

    return product;
}

