import { Either, left, right } from "@/core/either";

import { IUseCase } from "@/core/protocols/IUseCase";
import { Product } from "../entities/Product";
import { NotFoundError } from "../errors/not-found-error";
import { QuantityError } from "../errors/quantity-error";
import { ProductRepository } from "../repositories/product-repository";

interface EditProductUseCaseRequest {
    id: string;
    name: string;
    description: string;
    inStock: number;
    price: number;
}

type EditProductUseCaseResponse = Either<
    NotFoundError | QuantityError,
    {
        product: Product;
    }
>;

export class EditProductUseCase
    implements IUseCase<EditProductUseCaseRequest, EditProductUseCaseResponse>
{
    constructor(private productRepository: ProductRepository) {}

    async execute({
        id,
        name,
        description,
        price,
        inStock,
    }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            return left(new NotFoundError());
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.inStock = inStock;

        if (product.inStock < 1) {
            return left(new QuantityError());
        }

        await this.productRepository.save(product);

        return right({
            product,
        });
    }
}

