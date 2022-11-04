import { StatusCodes, getReasonPhrase } from "http-status-codes";
interface HttpErrorConstructor {
  statusCode: number;
  message?: string;
}

export class HttpError extends Error {
  readonly statusCode: number;
  readonly stackTrace: any;
  readonly statusText: string;
  readonly isHttpError: boolean;

  constructor(options: HttpErrorConstructor) {
    super(options.message);
    this.isHttpError = true;
    this.statusCode = options.statusCode;
    this.statusText = getReasonPhrase(options.statusCode);
    this.stackTrace = this.stack as string;
  }
}

export class NotImplemented extends HttpError {
  constructor() {
    super({
      message: "Not implemented yet.",
      statusCode: 501,
    });
  }
}
