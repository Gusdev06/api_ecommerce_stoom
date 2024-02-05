import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { IController } from "@/core/protocols/IController";

import { ListOrdersUseCase } from "@/domain/orders/use-cases/fetch-orders";
import { OrdersDetailsPresenter } from "@/infra/database/presenters/order-details-presenter";
import { NextFunction, Request, Response } from "express";

export class ListOrdersController implements IController {
    constructor(private readonly listOrdersUseCase: ListOrdersUseCase) {}

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

            const result = await this.listOrdersUseCase.execute({
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

            const orders: OrdersDetailsPresenter[] = result.value.result.map(
                (order) => OrdersDetailsPresenter.toHTTP(order),
            );

            return response.status(HttpStatusCode.OK).json({
                result: orders,
                totalRegisters: result.value.totalRegisters,
                totalPages: result.value.totalPages,
                currentPage: result.value.currentPage,
            });
        } catch (error) {
            next(error);
        }
    }
}

