import {
    IListUsersRequest,
    IListUsersResponse,
} from "@/core/pagination/pagination-params";
import { User } from "../entities/User";

export abstract class UserRepository {
    abstract findByMail(email: string): Promise<User | null>;
    abstract create(user: User): Promise<void>;
    abstract list({
        search,
        limit,
        offset,
    }: IListUsersRequest): Promise<IListUsersResponse | undefined>;
}

