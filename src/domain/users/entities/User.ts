import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface IUserProps {
    name: string;
    email: string;
    password: string;
}

export class User extends Entity<IUserProps> {
    get name() {
        return this.props.name;
    }

    get email() {
        return this.props.email;
    }

    get password() {
        return this.props.password;
    }

    static create(props: IUserProps, id?: UniqueEntityID) {
        const user = new User(props, id);

        return user;
    }
}

