import { Router } from "express"

import { authMiddleware, errorService } from "@tusksui/shared"

import { accountController } from "../controllers"
import { accountMiddleware } from "../middleware/account"

const router = Router()

router.get(
  "/all",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getAccounts)
)

router.get(
  "/:boardId/actions",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getActions)
)

router.get(
  "/:boardId/:attachmentId/action",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getActionByAttachmentId)
)

router.get(
  "/create",
  errorService.catchAsyncError(accountController.createAccount)
)

router.get(
  "/power-ups",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.getPowerUp)
)

router.get(
  "/verify/:token",
  accountMiddleware.validateVerificationJwt,
  errorService.catchAsyncError(accountController.verifyAccount)
)

router.post(
  "/comment",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.comment)
)

router.post(
  "/edit-comment",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.updateComment)
)

router.delete(
  "/:commentId/del-comment",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(accountController.deleteComment)
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
    accountMiddleware.checkAccountPlan,
    errorService.catchAsyncError(accountController.updateAccount)
  )

export { router as accountRoutes }
