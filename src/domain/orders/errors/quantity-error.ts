import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { ErrorHandler } from "@/core/errors/ErrorHandler";

export class QuantityError extends ErrorHandler {
    constructor() {
        super(
            `the quantity must be equal to or greater than 1`,
            HttpStatusCode.NOT_ACCEPTABLE,
        );
    }
}

