import { Either, left, right } from "@/core/either";
import { IUseCase } from "@/core/protocols/IUseCase";
import { Product } from "../entities/Product";
import { NotFoundError } from "../errors/not-found-error";
import { ProductRepository } from "../repositories/product-repository";

interface DeleteProductUseCaseRequest {
    id: string;
}

type DeleteProductUseCaseResponse = Either<
    NotFoundError,
    {
        product: Product;
    }
>;

export class DeleteProductUseCase
    implements
        IUseCase<DeleteProductUseCaseRequest, DeleteProductUseCaseResponse>
{
    constructor(private productRepository: ProductRepository) {}

    async execute({
        id,
    }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
        const product = await this.productRepository.findById(id);

        if (!product) {
            return left(new NotFoundError());
        }

        await this.productRepository.delete(product);

        return right({
            product,
        });
    }
}

