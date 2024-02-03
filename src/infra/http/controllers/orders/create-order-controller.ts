import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { IController } from "@/core/protocols/IController";
import { CreateOrderUseCase } from "@/domain/orders/use-cases/create-order";
import { OrdersPresenter } from "@/infra/database/presenters/order-presenter";

import { NextFunction, Request, Response } from "express";

export { CreateOrderController };

class CreateOrderController implements IController {
    constructor(private readonly useCase: CreateOrderUseCase) {}

    async handle(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { userId, itens, status } = request.body;

            const result = await this.useCase.execute({
                userId,
                itens,
            });

            if (result.isLeft())
                return response
                    .status(HttpStatusCode.BAD_REQUEST)
                    .json(result.value);

            return response
                .status(HttpStatusCode.CREATED)
                .json(OrdersPresenter.toHTTP(result.value?.order));
        } catch (error) {
            next(error);
        }
    }
}

