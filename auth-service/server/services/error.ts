import { Request, Response, NextFunction, ErrorRequestHandler } from "express"

import { CustomError, NotFoundError } from "../middleware/error"

class ErrorService {
  catchAsyncError = (asyncRequestHandler: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
      return asyncRequestHandler(req, res, next).catch(
        (err: ErrorRequestHandler) => {
          next(err)
        }
      )
    }
  }

  handleNotFoundError() {
    throw new NotFoundError()
  }

  errorHandler: ErrorRequestHandler = (
    error: CustomError | Error,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (error instanceof CustomError) {
      return res
        .status(error.statusCode)
        .send({ errors: error.serialiseError() })
    }

    res.status(400).send({ errors: [{ message: error.message }] })
  }
}

export default ErrorService
