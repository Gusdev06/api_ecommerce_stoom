import {
    IListPaginatedUseCase,
    IListUseCaseParams,
} from "@/core/protocols/IListUseCase";

import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { Either, right } from "@/core/either";
import { ErrorHandler } from "@/core/errors/ErrorHandler";
import { ICurrentPageValidation } from "@/core/pagination/adapters/ICurrentPageValidation";
import { IOffsetGenerator } from "@/core/pagination/adapters/IOffset";
import { ITotalPagesGenerator } from "@/core/pagination/adapters/ITotalPagesGenerator";
import { IPaginationResponse } from "@/core/pagination/interfaces/IPaginationResponse";
import { User } from "../entities/User";
import { UserRepository } from "../repositories/user-repository";

type FetchUsersUseCaseResponse = Either<Error, IPaginationResponse<User>>;
export class ListUsersUseCase
    implements IListPaginatedUseCase<FetchUsersUseCaseResponse>
{
    constructor(
        private readonly repository: UserRepository,
        private readonly offsetGenerator: IOffsetGenerator,
        private readonly totalPagesGenerator: ITotalPagesGenerator,
        private readonly currentPageValidation: ICurrentPageValidation,
    ) {}
    async execute({
        search,
        limit,
        page,
    }: IListUseCaseParams): Promise<FetchUsersUseCaseResponse> {
        const offset = this.offsetGenerator.generate({ page, limit });

        const users = await this.repository.list({
            search,
            limit: page !== undefined && limit ? limit : undefined,
            offset: page !== undefined && limit ? offset : undefined,
        });

        if (!users)
            throw new ErrorHandler(
                "Error on get users from database",
                HttpStatusCode.BAD_REQUEST,
            );

        const totalPages = this.totalPagesGenerator.generate({
            totalRegisters: users.count,
            limit,
        });

        return right({
            result: users.users, // Add 'result' property
            data: users.users,
            totalRegisters: users.count,
            totalPages,
            currentPage: page ?? 0,
        });
    }
}

