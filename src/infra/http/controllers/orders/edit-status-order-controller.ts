import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { IController } from "@/core/protocols/IController";
import { EditOrderStatusUseCase } from "@/domain/orders/use-cases/edit-order-status";

import { NextFunction, Request, Response } from "express";

export { EditOrderStatusController };

class EditOrderStatusController implements IController {
    constructor(private readonly useCase: EditOrderStatusUseCase) {}

    async handle(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { status } = request.body;
            const { id } = request.params;
            const result = await this.useCase.execute({
                id,
                status,
            });

            if (result.isLeft())
                return response
                    .status(HttpStatusCode.NOT_ACCEPTABLE)
                    .json(result.value);

            return response
                .status(HttpStatusCode.OK)
                .json(`Order status updated to ${status}`);
        } catch (error) {
            next(error);
        }
    }
}

