import { Router } from "express"
import multer from "multer"

import { authMiddleware, errorService, ROLES } from "@tusksui/shared"

import { boardController } from "../controllers"
import { boardMiddleware } from "../middleware"

const router = Router()

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({ storage })

router.get(
  "/unsplash/images",
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(boardController.getUnsplashImages)
)

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
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(boardController.createBoard)
)

router.post(
  "/upload/:boardId/add-cover",
  upload.array("file", 10),
  boardMiddleware.serializeUpload,
  authMiddleware.validateRequiredAccessJwt,
  authMiddleware.checkIsAuthenticated,
  errorService.catchAsyncError(boardController.uploadBgImage)
)

export { router as boardRoutes }
