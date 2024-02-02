import {
    createProductController,
    deleteProductController,
    editProductController,
    listProductsController,
} from "@/infra/http/controllers/products";
import { Router } from "express";

const ProductRoutes = Router();

ProductRoutes.post("/", (request, response, next) => {
    return createProductController.handle(request, response, next);
});

ProductRoutes.get("/", (request, response, next) => {
    return listProductsController.handle(request, response, next);
});

ProductRoutes.put("/:id", (request, response, next) => {
    return editProductController.handle(request, response, next);
});

ProductRoutes.delete("/:id", (request, response, next) => {
    return deleteProductController.handle(request, response, next);
});

export { ProductRoutes };

