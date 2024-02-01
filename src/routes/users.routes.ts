import {
    authenticateUserController,
    createAccountController,
    listUsersController,
} from "@/infra/http/controllers/users";
import { ensureAuth } from "@/infra/middlewares/ensureAuthenticateUser";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/register", (request, response, next) => {
    return createAccountController.handle(request, response, next);
});

userRoutes.get("/", ensureAuth, (request, response, next) => {
    return listUsersController.handle(request, response, next);
});

userRoutes.post("/auth", (request, response, next) => {
    return authenticateUserController.handle(request, response, next);
});

export { userRoutes };

