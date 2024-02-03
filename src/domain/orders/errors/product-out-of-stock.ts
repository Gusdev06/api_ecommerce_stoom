import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { ErrorHandler } from "@/core/errors/ErrorHandler";

export class ProductOutOfStockError extends ErrorHandler {
    constructor() {
        super(`Product out of stock`, HttpStatusCode.NOT_ACCEPTABLE);
    }
}

