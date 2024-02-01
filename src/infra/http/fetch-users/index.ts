import { CurrentPageValidation } from "@/core/pagination/adapters/implementations/CurrentPageValidation";
import { OffsetGenerator } from "@/core/pagination/adapters/implementations/Offset";
import { TotalPagesGenerator } from "@/core/pagination/adapters/implementations/TotalPagesGenerator";
import { ListUsersUseCase } from "@/domain/users/use-cases/fetch-users";
import { PrismaUserMapper } from "@/infra/database/mappers/prisma-user-mapper";
import { UserPrismaRepository } from "@/infra/database/repositories/prisma-user-repository";
import { ListUsersController } from "../fetch-users.controller";

const prismaUserMapper = new PrismaUserMapper();
const usersRepository = new UserPrismaRepository(prismaUserMapper);

const offsetGenerator = new OffsetGenerator();
const totalPagesGenerator = new TotalPagesGenerator();
const currentPageValidation = new CurrentPageValidation();
const listUsersUseCase = new ListUsersUseCase(
    usersRepository,
    offsetGenerator,
    totalPagesGenerator,
    currentPageValidation,
);

const listUsersController = new ListUsersController(listUsersUseCase);

export { listUsersController };

