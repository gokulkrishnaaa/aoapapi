import { CustomError } from "./custom-error";

export class CannotProcessError extends CustomError {
  statusCode = 422;

  constructor(public message: string, public field?: string) {
    super(message);

    Object.setPrototypeOf(this, CannotProcessError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message, field: this.field ? this.field : "" }];
  }
}
