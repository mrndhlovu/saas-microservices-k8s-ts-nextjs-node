import { Request, Response, NextFunction, ErrorRequestHandler } from "express"

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

  errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
    if (res.headersSent) return next(error)

    res.status(500)
    res.json({ error: error.message })
  }
}

export const ErrorServices = ErrorService

export default new ErrorService()
