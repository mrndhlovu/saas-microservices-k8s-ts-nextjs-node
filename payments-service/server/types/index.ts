export interface IOrderDetails {
  ownerId: string
  productId?: string
  priceId: string
  source?: string
  currency: CURRENCY_OPTIONS
  customerId?: string
  amount?: string
  paymentMethodId?: string
  plan?: string
}

export enum CURRENCY_OPTIONS {
  USD = "usd",
  EURO = "eur",
}

export interface INewSubscription {
  status: string
  productId: string
  startAt: number
  expiresAt: number
  customerId: string
  isTrial: boolean
  plan: string
}
