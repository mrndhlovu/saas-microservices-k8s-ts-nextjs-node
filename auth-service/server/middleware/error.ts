import { ValidationError } from "express-validator"

export abstract class CustomError extends Error {
  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract statusCode: number
  abstract serialiseError(): { message: string; field?: string }[]
}

class ErrorMiddleware extends CustomError {
  statusCode = 400

  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters")
    Object.setPrototypeOf(this, ErrorMiddleware.prototype)
  }

  serialiseError() {
    return this.errors.map(error => ({
      message: error.msg,
      field: error.param,
    }))
  }
}

class DatabaseErrorMiddleware extends CustomError {
  constructor(public message: string) {
    super("Invalid request parameters")
    Object.setPrototypeOf(this, DatabaseErrorMiddleware.prototype)
  }

  serialiseError() {
    return [{ message: this.message }]
  }
  statusCode = 400
}

class NotFoundError extends CustomError {
  constructor() {
    super("Route not found")
    Object.setPrototypeOf(this, NotFoundError)
  }

  serialiseError() {
    return [{ message: "Route not found" }]
  }
  statusCode = 404
}

class BadRequestError extends CustomError {
  statusCode = 404
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, BadRequestError)
  }

  serialiseError() {
    return [{ message: this.message }]
  }
}

class NotAuthorisedError extends CustomError {
  statusCode = 401
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, NotAuthorisedError)
  }

  serialiseError() {
    return [{ message: this.message }]
  }
}

export default ErrorMiddleware
export {
  ErrorMiddleware as CustomRequestError,
  DatabaseErrorMiddleware as CustomDatabaseRequestError,
  NotFoundError,
  BadRequestError,
  NotAuthorisedError,
}
