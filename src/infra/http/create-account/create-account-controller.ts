import { IController } from "@/core/protocols/IController";
import { UserPresenter } from "@/domain/users/presenters/user-presenter";
import { RegisterUserUseCase } from "@/domain/users/use-cases/register-user";
import { NextFunction, Request, Response } from "express";

export { CreateUserController };

class CreateUserController implements IController {
    constructor(private readonly useCase: RegisterUserUseCase) {}

    async handle(
        request: Request,
        response: Response,
        next: NextFunction,
    ): Promise<void | Response<any, Record<string, any>>> {
        try {
            const { name, email, password } = request.body;

            const result = await this.useCase.execute({
                name,
                email,
                password,
            });

            if (result.isLeft()) return response.status(400).json(result.value);

            return response
                .status(201)
                .json(UserPresenter.toHTTP(result.value?.user));
        } catch (error) {
            next(error);
        }
    }
}

