import { Router } from "express"
import multer from "multer"

import { errorService, authMiddleware } from "@tusksui/shared"

import { cardController } from "../controllers"
import { boardMiddleware, cardMiddleware } from "../middleware"

const router = Router()

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage })

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

router.post(
  "/new-label",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.createLabel)
)

router.get(
  "/user/labels",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.getLabelsByUserId)
)

router.get(
  "/:cardId/attachments",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.getAttachmentsByCardId)
)

router.post(
  "/upload/:cardId/add-cover",
  upload.array("file", 10),
  boardMiddleware.serializeUpload,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.uploadCoverImage)
)

router.delete(
  "/label/:labelId",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.deleteLabel)
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

router.patch(
  "/move",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(cardController.moveCard)
)

export { router as cardRoutes }
