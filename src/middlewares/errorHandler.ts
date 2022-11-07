import express, { Response, Request, NextFunction } from "express";
import { ValidateError } from "tsoa";
import { HttpError } from "../models/http.error.ts/index";

export function errorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
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
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      details: error.toString(),
    });
  }

  next();
}
