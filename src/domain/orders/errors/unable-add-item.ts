import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { ErrorHandler } from "@/core/errors/ErrorHandler";

export class UnableAddItem extends ErrorHandler {
    constructor() {
        super(
            `It is not possible to edit this order`,
            HttpStatusCode.NOT_ACCEPTABLE,
        );
    }
}

export class InvalidStatusError extends ErrorHandler {}

