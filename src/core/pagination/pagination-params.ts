import { User } from "@/domain/users/entities/User";

export interface IListUsersResponse {
    users: User[];
    count: number;
}

export interface IListUsersRequest {
    search?: string;
    limit?: number;
    offset?: number;
}

export interface IListUseCaseParams {
    search?: string;
    limit?: number;
    page?: number;
    orderBy?: string;
    orderMode?: string;
}

