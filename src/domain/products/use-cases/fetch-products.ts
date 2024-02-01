import { IListUseCaseParams } from "@/core/protocols/IListUseCase";

import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { Either, right } from "@/core/either";
import { ErrorHandler } from "@/core/errors/ErrorHandler";
import { IOffsetGenerator } from "@/core/pagination/adapters/IOffset";
import { ITotalPagesGenerator } from "@/core/pagination/adapters/ITotalPagesGenerator";
import { IPaginationResponse } from "@/core/pagination/interfaces/IPaginationResponse";
import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product-repository";

type FetchProductsUseCaseResponse = Either<Error, IPaginationResponse<Product>>;
export class ListProductsUseCase {
    constructor(
        private readonly repository: ProductRepository,
        private readonly offsetGenerator: IOffsetGenerator,
        private readonly totalPagesGenerator: ITotalPagesGenerator,
    ) {}
    async execute({
        search,
        limit,
        page,
    }: IListUseCaseParams): Promise<FetchProductsUseCaseResponse> {
        const offset = this.offsetGenerator.generate({ page, limit });

        const products = await this.repository.list({
            search,
            limit: page !== undefined && limit ? limit : undefined,
            offset: page !== undefined && limit ? offset : undefined,
        });

        if (!products)
            throw new ErrorHandler(
                "Error on get products from database",
                HttpStatusCode.BAD_REQUEST,
            );

        const totalPages = this.totalPagesGenerator.generate({
            totalRegisters: products.count,
            limit,
        });

        return right({
            result: products.products,
            totalRegisters: products.count,
            totalPages,
            currentPage: page ?? 0,
        });
    }
}

