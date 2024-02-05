import { IListUseCaseParams } from "@/core/protocols/IListUseCase";

import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { Either, right } from "@/core/either";
import { ErrorHandler } from "@/core/errors/ErrorHandler";
import { IOffsetGenerator } from "@/core/pagination/adapters/IOffset";
import { ITotalPagesGenerator } from "@/core/pagination/adapters/ITotalPagesGenerator";
import { IPaginationResponse } from "@/core/pagination/interfaces/IPaginationResponse";

import { OrderDetails } from "../entities/value-objects/order-details";
import { OrderRepository } from "../repositories/order-repository";

type FetchOrdersUseCaseResponse = Either<
    Error,
    IPaginationResponse<OrderDetails>
>;
export class ListOrdersUseCase {
    constructor(
        private readonly repository: OrderRepository,
        private readonly offsetGenerator: IOffsetGenerator,
        private readonly totalPagesGenerator: ITotalPagesGenerator,
    ) {}
    async execute({
        search,
        limit,
        page,
    }: IListUseCaseParams): Promise<FetchOrdersUseCaseResponse> {
        const offset = this.offsetGenerator.generate({ page, limit });

        const orders = await this.repository.list({
            search,
            limit: page !== undefined && limit ? limit : undefined,
            offset: page !== undefined && limit ? offset : undefined,
        });

        if (!orders)
            throw new ErrorHandler(
                "Error on get orders from database",
                HttpStatusCode.BAD_REQUEST,
            );

        const totalPages = this.totalPagesGenerator.generate({
            totalRegisters: orders.count,
            limit,
        });

        return right({
            result: orders.orders,
            totalRegisters: orders.count,
            totalPages,
            currentPage: page ?? 0,
        });
    }
}

