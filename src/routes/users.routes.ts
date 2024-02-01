import {
    createAccountController,
    listUsersController,
} from "@/infra/http/controllers/users";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/register", (request, response, next) => {
    return createAccountController.handle(request, response, next);
});

userRoutes.get("/", (request, response, next) => {
    return listUsersController.handle(request, response, next);
});

export { userRoutes };

