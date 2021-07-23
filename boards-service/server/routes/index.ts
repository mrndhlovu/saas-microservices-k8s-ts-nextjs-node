import { Router } from "express"

import { authMiddleware, errorService, ROLES } from "@tuskui/shared"

import { boardController } from "../controller"
import { boardMiddleware } from "../middleware"

const router = Router()

router.get(
  "/",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(boardController.getBoardList)
)

router
  .route("/:boardId")
  .get(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    boardMiddleware.verifyAccessPermission(ROLES.OBSERVER),
    errorService.catchAsyncError(boardController.getBoardById)
  )
  .patch(
    boardMiddleware.checkRequiredBodyFields,
    boardMiddleware.validateRequestBodyFields,
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    boardMiddleware.verifyAccessPermission(ROLES.EDITOR),
    boardMiddleware.checkDuplicateBoards,
    errorService.catchAsyncError(boardController.updateBoard)
  )
  .delete(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    boardMiddleware.verifyAccessPermission(ROLES.OWNER),
    errorService.catchAsyncError(boardController.deleteBoard)
  )

router.post(
  "/create",
  boardMiddleware.checkRequiredBodyFields,
  boardMiddleware.validateRequestBodyFields,
  boardMiddleware.checkDuplicateBoards,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(boardController.createBoard)
)

export default router
