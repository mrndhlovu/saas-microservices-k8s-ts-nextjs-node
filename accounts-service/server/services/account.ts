import { AccountOptions } from "@tusksui/shared"

import Account, { IAccountDocument } from "../models/Account"
import PowerUp from "../models/Powerup"

class AccountServices {
  findAccountOnlyByUseIdPopulated = async (userId: string) => {
    const account = await Account.findOne({ _id: userId }).populate({
      path: "powerUps",
      model: "PowerUp",
      select: { tokens: 0, updatedAt: 0 },
    })
    return account
  }

  findAccountOnlyByUseId = async (userId: string) => {
    const account = await Account.findOne({ _id: userId })
    return account
  }

  findPowerUpByUseIdAndName = async (userId: string, name: string) => {
    const powerUp = await PowerUp.findOne({ ownerId: userId, name })
    return powerUp
  }

  findPowerUpOnlyById = async (_id: string) => {
    const powerUp = await PowerUp.findOne({ _id })
    return powerUp
  }

  addAccountExpiryDate = (account: IAccountDocument) => {
    const EXPIRATION_WINDOW_SECONDS = 10080 * 60 // 7 days
    const expiration = new Date()

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    account.expiresAt = expiration

    return account
  }

  findAccountByPlan = async (type: AccountOptions, accountId: string) => {
    const account = await Account.findOne({ plan: type, _id: accountId })
    return account
  }

  async findAccountByIdAndUpdate(updates: any, accountId: string) {
    const updatedRecord = await Account.findOneAndUpdate(
      { _id: accountId },
      { $set: { ...updates } },
      { new: true }
    )

    return updatedRecord
  }

  validateEditableFields = <T>(allowedFields: T[], updates: T[]) => {
    return updates.every((update: T) => allowedFields.includes(update))
  }

  validateAccountPlan = (account: IAccountDocument) => {
    const now = Date.now()
    const today = new Date(now)
    const accountExpired = account?.expiresAt < today

    if (account.isTrial && accountExpired) {
      account.isTrial = false
    }

    if (accountExpired) {
      account.expired = true
      account.plan = AccountOptions.Free
    }

    return account
  }

  getEventData(account: any) {
    Object.keys(account).map(key => {
      if (key === "__v") {
        delete account.__v
      }

      if (key === "tokens") {
        delete account.tokens
      }

      if (key === "_id") {
        account.id = account._id
        delete account._id
      }
    })

    return account
  }
}

export const accountService = new AccountServices()
