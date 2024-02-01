import { User } from "@/domain/users/entities/User";
import { UserRepository } from "@/domain/users/repositories/user-repository";

export class InMemoryUsersRepository implements UserRepository {
    public items: User[] = [];

    async findByMail(email: string) {
        const user = this.items.find((item) => item.email === email);

        if (!user) {
            return null;
        }

        return user;
    }

    async create(user: User) {
        this.items.push(user);
    }
}
