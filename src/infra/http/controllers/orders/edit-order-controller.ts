import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { IController } from "@/core/protocols/IController";
import { EditOrderUseCase } from "@/domain/orders/use-cases/edit-order";
import { OrdersPresenter } from "@/infra/database/presenters/order-presenter";

import { NextFunction, Request, Response } from "express";

export { EditOrderController };

class EditOrderController implements IController {
    constructor(private readonly useCase: EditOrderUseCase) {}

    async handle(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { itens, status } = request.body;
            const { id } = request.params;
            const result = await this.useCase.execute({
                id,
                itens,
                status,
            });

            if (result.isLeft())
                return response
                    .status(HttpStatusCode.BAD_REQUEST)
                    .json(result.value);

            return response
                .status(HttpStatusCode.OK)
                .json(OrdersPresenter.toHTTP(result.value?.order));
        } catch (error) {
            next(error);
        }
    }
}

