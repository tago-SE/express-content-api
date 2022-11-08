import { Response, Request, NextFunction } from "express";
import { v4 } from "uuid";

const QueryTag = "correlationId";

export function appendCorrelationIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const existingCorrelationId = req.query[QueryTag];
  if (!existingCorrelationId || typeof existingCorrelationId !== "string") {
    const id = v4();
    console.log("Corr", id);
    req.query[QueryTag] = id;
  }
  next();
}
