import { InMemoryUsersRepository } from "./../../../test/in-memory-user-repository";
import { RegisterUserUseCase } from "./register-user";

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: RegisterUserUseCase;

describe("register User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new RegisterUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to register a new user", async () => {
        const result = await sut.execute({
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        });

        expect(result.value).toEqual({
            user: inMemoryUsersRepository.items[0],
        });
    });
});

