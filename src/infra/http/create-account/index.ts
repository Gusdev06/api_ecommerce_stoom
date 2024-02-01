import { RegisterUserUseCase } from "@/domain/users/use-cases/register-user";
import { UserPrismaRepository } from "@/infra/database/repositories/prisma-user-repository";

import { PrismaUserMapper } from "../../database/mappers/prisma-user-mapper";
import { CreateUserController } from "./create-account-controller";

const prismaUserMapper = new PrismaUserMapper();
const prismaUserRepository = new UserPrismaRepository(prismaUserMapper);
const registerUserUseCase = new RegisterUserUseCase(prismaUserRepository);
const createAccountController = new CreateUserController(registerUserUseCase);

export { createAccountController };

