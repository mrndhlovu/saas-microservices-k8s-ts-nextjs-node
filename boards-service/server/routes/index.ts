import { Router } from "express"

import { authMiddleware, errorService, PERMISSION_FLAGS } from "@tuskui/shared"

import { boardController } from "../controller"
import { boardMiddleware } from "../middleware"

const router = Router()
const boardRoutes = () => {
  router.get(
    "",
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(boardController.getBoardList)
  )

  router
    .route("/:boardId")
    .get(
      authMiddleware.validateRequiredAccessJwt,
      authMiddleware.checkIsAuthenticated,
      boardController.getBoardById
    )
    .patch(
      authMiddleware.validateRequiredAccessJwt,
      authMiddleware.checkIsAuthenticated,
      boardController.updateBoard
    )
    .delete(
      authMiddleware.validateRequiredAccessJwt,
      authMiddleware.checkIsAuthenticated,
      boardMiddleware.checkActionPermission(PERMISSION_FLAGS.ADMIN),
      errorService.catchAsyncError(boardController.deleteBoard)
    )

  router.post(
    "/create",
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(boardController.createBoard)
  )

  return router
}

export { boardRoutes }
