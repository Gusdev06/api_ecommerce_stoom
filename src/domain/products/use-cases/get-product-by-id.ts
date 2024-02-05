import { Either, left, right } from "@/core/either";
import { IUseCase } from "@/core/protocols/IUseCase";
import { Product } from "../entities/Product";
import { NotFoundError } from "../errors/not-found-error";
import { ProductRepository } from "../repositories/product-repository";

interface getProductUseCaseRequest {
    id: string;
}

type getProductUseCaseResponse = Either<
    NotFoundError,
    {
        product: Product;
    }
>;

export class GetProductUseCase
    implements IUseCase<getProductUseCaseRequest, getProductUseCaseResponse>
{
    constructor(private productRepository: ProductRepository) {}

    async execute({
        id,
    }: getProductUseCaseRequest): Promise<getProductUseCaseResponse> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            return left(new NotFoundError());
        }

        return right({
            product,
        });
    }
}

