import { ObjectId } from "mongodb"
import jwt, { VerifyErrors } from "jsonwebtoken"

import { IBoardRoleJwtToken, IJwtToken, JWTSignKeyOption } from "utils/types"
import { Services } from "."
import Board, { BoardDocument } from "../models/Board"

class BoardServices {
  private decodedJwtCallback = (err: VerifyErrors, payload: IJwtToken) => {
    if (err) throw new Error("Access token failed validation.")

    return payload
  }

  assignBoardRole = async (
    role: number,
    userId: string,
    board: BoardDocument
  ) => {
    const adminTokenData = { admin: `${userId}`, flag: role }

    const adminToken = await Services.board.encryptRoleToken(adminTokenData)

    board.admin = adminToken

    return board
  }

  populatedBoard = async (boardId: ObjectId | string) => {
    const board = await Board.findById(boardId)
    return board
  }

  encryptRoleToken = async (tokenToSign: IBoardRoleJwtToken) => {
    const token: any = jwt.sign(tokenToSign, process.env.BOARD_TOKEN_SIGNATURE!)

    return token
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  decodeJwtToken(token: string, type?: JWTSignKeyOption) {
    const decodedJWT = <any>(
      jwt.verify(
        token,
        process.env.BOARD_TOKEN_SIGNATURE!,
        this.decodedJwtCallback as any
      )
    )

    return decodedJWT as any
  }
}

export default new BoardServices()
