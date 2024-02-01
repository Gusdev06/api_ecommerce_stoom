import { Either, left, right } from "@/core/either";
import { IUseCase } from "@/core/protocols/IUseCase";
import { Product } from "../entities/Product";
import { QuantityError } from "../errors/quantity-error";
import { ProductRepository } from "../repositories/product-repository";

export interface ICreateProductDTO {
    name: string;
    description: string;
    price: number;
    inStock: number;
}

type CreateProductUseCaseResponse = Either<
    QuantityError,
    {
        product: Product;
    }
>;
export class CreateProductUseCase
    implements IUseCase<ICreateProductDTO, CreateProductUseCaseResponse>
{
    constructor(private readonly productRepository: ProductRepository) {}

    async execute({
        name,
        description,
        price,
        inStock,
    }: ICreateProductDTO): Promise<CreateProductUseCaseResponse> {
        const product = Product.create({
            name,
            description,
            price,
            inStock,
        });

        if (inStock < 1) {
            return left(new QuantityError());
        }

        await this.productRepository.create(product);

        return right({
            product,
        });
    }
}

