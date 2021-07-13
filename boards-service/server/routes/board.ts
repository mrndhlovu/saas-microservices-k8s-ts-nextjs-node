import { Router } from "express"
import { Controller } from "../controllers"

import { Validator } from "../middleware"
import { Services } from "../services"

const router = Router()
const boardRoutes = () => {
  router.get(
    "",
    // Validator.auth.validateRequiredAccessJwt,
    // Validator.auth.checkIsAuthenticated,
    Services.error.catchAsyncError(Controller.Board.getBoardList)
  )

  router
    .route("/:boardId")
    .get(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Controller.Board.getBoardById
    )
    .patch(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Controller.Board.updateBoard
    )
    .delete(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Validator.role.boardAdmin,
      Services.error.catchAsyncError(Controller.Board.deleteBoard)
    )

  router.post(
    "/create",
    // Validator.auth.validateRequiredAccessJwt,
    // Validator.auth.checkIsAuthenticated,
    Services.error.catchAsyncError(Controller.Board.createBoard)
  )

  return router
}

export default boardRoutes
