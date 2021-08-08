export interface IOrderDetails {
  ownerId: string
  subscriptionId?: string
  amount: string
  source?: string
  currency: CURRENCY_OPTIONS
}

export enum CURRENCY_OPTIONS {
  USD = "usd",
  EURO = "eur",
}
