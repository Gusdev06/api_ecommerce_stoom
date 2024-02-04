import {
    createOrderController,
    deleteOrderController,
    editOrderController,
} from "@/infra/http/controllers/orders";
import { ensureAuth } from "@/infra/middlewares/ensureAuthenticateUser";
import { Router } from "express";

const OrderRoutes = Router();

OrderRoutes.post("/", ensureAuth, (request, response, next) => {
    return createOrderController.handle(request, response, next);
});

OrderRoutes.put("/:id", ensureAuth, (request, response, next) => {
    return editOrderController.handle(request, response, next);
});

OrderRoutes.delete("/:id", ensureAuth, (request, response, next) => {
    return deleteOrderController.handle(request, response, next);
});
export { OrderRoutes };

