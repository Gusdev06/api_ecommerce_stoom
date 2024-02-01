import { CurrentPageValidation } from "@/core/pagination/adapters/implementations/CurrentPageValidation";
import { OffsetGenerator } from "@/core/pagination/adapters/implementations/Offset";
import { TotalPagesGenerator } from "@/core/pagination/adapters/implementations/TotalPagesGenerator";
import { ListUsersUseCase } from "@/domain/users/use-cases/fetch-users";
import { RegisterUserUseCase } from "@/domain/users/use-cases/register-user";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { UserPrismaRepository } from "@/infra/database/repositories/prisma-user-repository";
import { CreateUserController } from "./create-account-controller";
import { ListUsersController } from "./fetch-users.controller";

const usersRepository = new UserPrismaRepository();
const offsetGenerator = new OffsetGenerator();
const totalPagesGenerator = new TotalPagesGenerator();
const currentPageValidation = new CurrentPageValidation();
const listUsersUseCase = new ListUsersUseCase(
    usersRepository,
    offsetGenerator,
    totalPagesGenerator,
    currentPageValidation,
);
const bcryptHasher = new BcryptHasher();
const prismaUserRepository = new UserPrismaRepository();
const registerUserUseCase = new RegisterUserUseCase(
    prismaUserRepository,
    bcryptHasher,
);
const createAccountController = new CreateUserController(registerUserUseCase);
const listUsersController = new ListUsersController(listUsersUseCase);
export { createAccountController, listUsersController };

