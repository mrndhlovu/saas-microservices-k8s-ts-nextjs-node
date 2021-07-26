import { Router } from "express"

import { authMiddleware, errorService } from "@tuskui/shared"

import { upgradeController } from "../controllers/upgrade"
import { upgradeMiddleware } from "../middleware/upgrade"

const router = Router()

router.get(
  "/all/:boardId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(upgradeController.getList)
)

router
  .route("/:boardId/:listId")
  .get(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(upgradeController.getListById)
  )
  .patch(
    upgradeMiddleware.checkRequiredBodyFields,
    upgradeMiddleware.validateRequestBodyFields,
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(upgradeController.updateList)
  )
  .delete(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(upgradeController.deleteList)
  )

router.delete(
  "/:boardId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(upgradeController.deleteList)
)

router.post(
  "/create/:boardId",
  upgradeMiddleware.checkRequiredBodyFields,
  upgradeMiddleware.validateRequestBodyFields,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(upgradeController.createList)
)

export { router as upgradeRoutes }
