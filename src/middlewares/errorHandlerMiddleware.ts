import { Response, Request, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../models/http.error/index.js";

export function errorHandlerMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  console.log("ERROR COUGH");
  if (error instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, error.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: error?.fields,
    });
  }
  if (error instanceof HttpError) {
    return res.status(error.statusCode).send(error);
  }
  if (error instanceof Error) {
    console.error(error.toString());
    return res.status(500).json({
      message: "Internal Server Error",
      details: error.toString(),
    });
  }
  next();
}
