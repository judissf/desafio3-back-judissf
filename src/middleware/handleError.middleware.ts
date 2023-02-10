import { Response, Request, NextFunction } from "express"
import { AppError } from "../errors/appError"

export const handleErrorMiddleware = (err: Error, req: Request, res: Response, next:NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message
    })
  }

  return res.status(500).json({
    status: "error",
    statusCode: 500,
    message: "Internal server error!"
  })
}
