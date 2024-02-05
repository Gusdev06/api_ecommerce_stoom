import { HttpStatusCode } from "@/core/constants/HttpStatusCode";
import { ErrorHandler } from "@/core/errors/ErrorHandler";

export class InvalidStatusError extends ErrorHandler {
    constructor() {
        super("type status invalid ", HttpStatusCode.NOT_ACCEPTABLE);
    }
}

