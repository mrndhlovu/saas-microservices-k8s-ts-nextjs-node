import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { accountController } from "../controllers/account"
import { accountMiddleware } from "../middleware/account"

const router = Router()

router.get(
  "/all",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getAccounts)
)

router
  .route("/")
  .get(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    accountMiddleware.checkAccountPlan,
    errorService.catchAsyncError(accountController.getAccountById)
  )
  .patch(
    accountMiddleware.checkRequiredBodyFields,
    accountMiddleware.validateRequestBodyFields,
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(accountController.updateAccount)
  )
  .delete(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(accountController.deleteAccount)
  )

export { router as accountRoutes }
