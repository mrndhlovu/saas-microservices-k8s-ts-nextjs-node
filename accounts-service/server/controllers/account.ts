import { Request, Response } from "express"

import { BadRequestError } from "@tusksui/shared"

import { allowedAccountUpdateFields } from "../utils/constants"
import { accountService } from "../services/account"
import Account, { IAccountDocument } from "../models/Account"

declare global {
  namespace Express {
    interface Request {
      account: IAccountDocument | null | undefined
    }
  }
}

class AccountController {
  getAccounts = async (req: Request, res: Response) => {
    const accounts = await Account.find({})

    res.send(accounts)
  }

  getAccountById = async (req: Request, res: Response) => {
    const account = await accountService.findAccountOnlyByUseId(
      req.currentUserJwt.userId
    )

    if (!account)
      throw new BadRequestError("Account with that id was not found")

    res.send(account)
  }

  updateAccount = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body)
    const account = await accountService.findAccountOnlyByUseId(
      req.currentUserJwt.userId
    )

    const hasValidFields = accountService.validateEditableFields(
      allowedAccountUpdateFields,
      updates
    )

    if (!hasValidFields) throw new BadRequestError("Invalid update field")

    const updatedRecord = await Account.findOneAndUpdate(
      { _id: account!._id },
      { $set: { ...req.body } },
      { new: true }
    )

    if (req.body.isTrial) {
      accountService.addAccountExpiryDate(updatedRecord!)
    }

    await updatedRecord!.save()

    res.status(200).send(updatedRecord)
  }

  deleteAccount = async (req: Request, res: Response) => {
    const account = await accountService.findAccountById(req.params.accountId)

    await account!.delete()

    res.status(200).send({})
  }
}

export const accountController = new AccountController()
