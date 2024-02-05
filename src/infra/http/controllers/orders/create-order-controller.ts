import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { IController } from "@/core/protocols/IController";

import { ProductOutOfStockError } from "@/domain/orders/errors/product-out-of-stock";
import { QuantityError } from "@/domain/orders/errors/quantity-error";
import { CreateOrderUseCase } from "@/domain/orders/use-cases/create-order";
import { NotFoundError } from "@/domain/products/errors/not-found-error";
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
            const { itens } = request.body;
            const userId = request.userId;
            const result = await this.useCase.execute({
                userId,
                itens,
            });

            if (result.isLeft()) {
                const error = result.value;

                if (error instanceof NotFoundError) {
                    return response
                        .status(HttpStatusCode.NOT_FOUND)
                        .json(error);
                } else if (error instanceof ProductOutOfStockError) {
                    return response
                        .status(HttpStatusCode.NOT_ACCEPTABLE)
                        .json(error);
                } else if (error instanceof QuantityError) {
                    return response
                        .status(HttpStatusCode.NOT_ACCEPTABLE)
                        .json(error);
                }

                return response
                    .status(HttpStatusCode.SERVER_ERROR)
                    .json({ message: "Internal Server Error" });
            }

            return response
                .status(HttpStatusCode.CREATED)
                .json(OrdersPresenter.toHTTP(result.value?.order));
        } catch (error) {
            next(error);
        }
    }
}

