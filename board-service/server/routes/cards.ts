import { Router } from "express"

import { errorService, authMiddleware } from "@tuskui/shared"

import { cardController } from "../controllers"
import { cardMiddleware } from "../middleware"

const router = Router()

router.get(
  "/:listId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.getCards)
)

router.post(
  "/:listId/:boardId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.createCard)
)

router
  .route("/id/:cardId/:listId")
  .get(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    cardController.getCardById
  )
  .patch(
    cardMiddleware.checkRequiredBodyFields,
    cardMiddleware.validateRequestBodyFields,
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(cardController.updateCard)
  )
  .delete(
    authMiddleware.validateRequiredAccessJwt,
    authMiddleware.checkIsAuthenticated,
    errorService.catchAsyncError(cardController.deleteCard)
  )

export { router as cardRoutes }
