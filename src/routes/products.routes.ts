import { createProductController } from "@/infra/http/controllers/products";
import { Router } from "express";

const ProductRoutes = Router();

ProductRoutes.post("/", (request, response, next) => {
    return createProductController.handle(request, response, next);
});

export { ProductRoutes };

