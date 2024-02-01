import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { IController } from "@/core/protocols/IController";

import { ListUsersUseCase } from "@/domain/users/use-cases/fetch-users";
import { UserPresenter } from "@/infra/database/presenters/user-presenter";
import { NextFunction, Request, Response } from "express";

export class ListUsersController implements IController {
    constructor(private readonly listUsersUseCase: ListUsersUseCase) {}

    async handle(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void | Response<any, Record<string, any>>> {
        try {
            const {
                q: search,
                p: page,
                l: limit,
                orderBy,
                orderMode,
            } = request.query;

            const result = await this.listUsersUseCase.execute({
                search: search?.toString(),
                limit: limit ? Number(limit) : undefined,
                page: limit ? Number(page) : undefined,
                orderBy: orderBy?.toString(),
                orderMode: orderMode?.toString(),
            });

            if (result.isLeft()) {
                return response
                    .status(HttpStatusCode.BAD_REQUEST)
                    .json(result.value);
            }

            const users: UserPresenter[] = result.value.result.map((user) =>
                UserPresenter.toHTTP(user),
            );

            return response.status(HttpStatusCode.OK).json({
                result: users,

                totalRegisters: result.value.totalRegisters,
                totalPages: result.value.totalPages,
                currentPage: result.value.currentPage,
            });
        } catch (error) {
            next(error);
        }
    }
}

