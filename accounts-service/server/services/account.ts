import { ObjectId } from "mongodb"

import { AccountOptions } from "@tusksui/shared"

import Account, { IAccountDocument } from "../models/Account"

class AccountServices {
  findAccountOnlyByUseId = async (userId: string) => {
    const account = await Account.findOne({ userId })
    return account
  }

  findAccountById = async (accountId: string) => {
    const account = await Account.findOne({ _id: accountId })
    return account
  }

  addAccountExpiryDate = (account: IAccountDocument) => {
    const EXPIRATION_WINDOW_SECONDS = 10080 * 60 // 7 days
    const expiration = new Date()

    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)
    account.expiresAt = expiration

    return account
  }

  findAccountOnlyByType = async (type: AccountOptions) => {
    const account = await Account.findOne({ option: type })
    return account
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
}

export const accountService = new AccountServices()
