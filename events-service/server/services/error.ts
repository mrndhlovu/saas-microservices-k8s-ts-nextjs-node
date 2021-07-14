import { Response, NextFunction, ErrorRequestHandler } from "express"

class Error {
  catchAsyncError = (asyncRequestHandler: any) => {
    return (req: any, res: Response, next: NextFunction) => {
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
export default new Error()
