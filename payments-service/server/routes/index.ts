import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { paymentController } from "../controllers"
import { paymentMiddleware } from "../middleware"

const router = Router()

router.get(
  "/",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(paymentController.getPayments)
)

router.post(
  "/charge",
  paymentMiddleware.checkRequiredBodyFields,
  paymentMiddleware.validateRequestBodyFields,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  paymentMiddleware.validateOrderExists,
  errorService.catchAsyncError(paymentController.createCharge)
)

router
  .route("/")
  .get(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(paymentController.getPaymentById)
  )

  .delete(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(paymentController.deletePayment)
  )

export { router as paymentRoutes }
