import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { User } from "@/domain/users/entities/User";
import { Prisma, User as PrismaUser } from "@prisma/client";

export class PrismaUserMapper {
    public toDomain(raw: PrismaUser): User {
        return User.create(
            {
                name: raw.name,
                email: raw.email,
                password: raw.password,
            },
            new UniqueEntityID(raw.id),
        );
    }

    public toPrisma(user: User): Prisma.UserUncheckedCreateInput {
        return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            password: user.password,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}
