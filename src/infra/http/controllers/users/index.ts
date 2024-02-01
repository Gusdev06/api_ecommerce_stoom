import { CurrentPageValidation } from "@/core/pagination/adapters/implementations/CurrentPageValidation";
import { OffsetGenerator } from "@/core/pagination/adapters/implementations/Offset";
import { TotalPagesGenerator } from "@/core/pagination/adapters/implementations/TotalPagesGenerator";
import { AuthenticateUserUseCase } from "@/domain/users/use-cases/authenticate-user";
import { ListUsersUseCase } from "@/domain/users/use-cases/fetch-users";
import { RegisterUserUseCase } from "@/domain/users/use-cases/register-user";
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher";
import { UserPrismaRepository } from "@/infra/database/repositories/prisma-user-repository";
import { JwtEncrypter } from "./../../../cryptography/jwt-encrypter";
import { AuthenticateUserController } from "./authenticate-user.controller";
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
const jwtEncrypter = new JwtEncrypter();
const bcryptHasher = new BcryptHasher();

const prismaUserRepository = new UserPrismaRepository();
const registerUserUseCase = new RegisterUserUseCase(
    prismaUserRepository,
    bcryptHasher,
);
const authenticateUserUseCase = new AuthenticateUserUseCase(
    prismaUserRepository,
    bcryptHasher,
    jwtEncrypter,
);
const authenticateUserController = new AuthenticateUserController(
    authenticateUserUseCase,
);
const createAccountController = new CreateUserController(registerUserUseCase);
const listUsersController = new ListUsersController(listUsersUseCase);
export {
    authenticateUserController,
    createAccountController,
    listUsersController,
};

