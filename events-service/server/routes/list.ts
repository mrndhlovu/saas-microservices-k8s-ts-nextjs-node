import { Router } from "express"

import { Controller } from "../controllers"
import { Services } from "../services"

const router = Router()

const listRoutes = () => {
  router.get(
    "/:boardId",
    // Validator.auth.validateRequiredAccessJwt,
    // Validator.auth.checkIsAuthenticated,
    Services.error.catchAsyncError(Controller.List.getLists)
  )

  router
    .route("/:boardId/:listId")
    .get(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.List.getListById)
    )
    .patch(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.List.updateList)
    )
    .delete(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.List.deleteList)
    )

  router.post(
    "/create",
    // Validator.auth.validateRequiredAccessJwt,
    // Validator.auth.checkIsAuthenticated,
    Services.error.catchAsyncError(Controller.List.createList)
  )

  router.delete(
    "/:boardId",
    // Validator.auth.validateRequiredAccessJwt,
    // Validator.auth.checkIsAuthenticated,
    Services.error.catchAsyncError(Controller.List.deleteList)
  )

  return router
}

export default listRoutes
