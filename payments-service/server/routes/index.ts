import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { paymentController } from "../controllers"
import { paymentMiddleware } from "../middleware"

const router = Router()

router.get(
  "/order/:orderId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  paymentMiddleware.checkOrderExists,
  errorService.catchAsyncError(paymentController.getOrderById)
)

router.get(
  "/",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(paymentController.getPayments)
)

router.get(
  "/products",
  errorService.catchAsyncError(paymentController.getStripeProductsPriceList)
)

router.post(
  "/create",
  paymentMiddleware.checkRequiredOrderFields,
  paymentMiddleware.validateRequestBodyFields,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(paymentController.createOrder)
)

router.post(
  "/subscription",
  paymentMiddleware.checkRequiredOrderFields,
  paymentMiddleware.validateRequestBodyFields,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(paymentController.createSubscription)
)

router.delete(
  "/delete/:orderId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  paymentMiddleware.checkOrderExists,
  paymentMiddleware.checkOrderIsNotPaid,
  errorService.catchAsyncError(paymentController.deleteOrder)
)

export { router as paymentRoutes }
