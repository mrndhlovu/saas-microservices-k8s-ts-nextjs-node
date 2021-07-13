import { Router } from "express"

import { Controller } from "../controllers"
import { Services } from "../services"

const router = Router()

const cardRoutes = () => {
  router
    .route("/:listId")
    .get(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.Card.getCards)
    )
    .post(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.Card.createCard)
    )

  router
    .route("/id/:cardId/:listId")
    .get(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Controller.Card.getCardById
    )
    .patch(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.Card.updateCard)
    )
    .delete(
      // Validator.auth.validateRequiredAccessJwt,
      // Validator.auth.checkIsAuthenticated,
      Services.error.catchAsyncError(Controller.Card.deleteCard)
    )

  return router
}

export default cardRoutes
