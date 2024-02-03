import { createOrderController } from "@/infra/http/controllers/orders";
import { Router } from "express";

const OrderRoutes = Router();

OrderRoutes.post("/", (request, response, next) => {
    return createOrderController.handle(request, response, next);
});

export { OrderRoutes };

