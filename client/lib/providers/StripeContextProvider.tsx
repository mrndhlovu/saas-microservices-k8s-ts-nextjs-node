import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { ReactNode } from "react"

import {
  ICardDetails,
  StripeContext,
  useAuth,
  useGlobalState,
} from "../hooks/context"
import { clientRequest } from "../../api"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export interface IStripeProduct {
  [key: string]: any
}

export interface IStripeInvoice {
  periodEnd: string
  periodStart: string
  invoiceUrl: string
  invoiceId: string
  description: string
  billingMethod: string
  amountPaid: number
  isPaid: boolean
  invoicePdf: string
  currency: string
  [key: string]: any
}
interface IProps {
  data?: { products: IStripeProduct[]; invoices?: IStripeInvoice[] }
  children: ReactNode
}

const StripeContextProvider = ({ children, data }: IProps) => {
  const { fetchUser } = useAuth()
  const { notify } = useGlobalState()

  const createSubscription = async (data: ICardDetails) => {
    return new Promise(async (resolve, reject) => {
      await clientRequest
        .createCustomerSubscription(data)
        .then(res => {
          fetchUser()
          return resolve(res)
        })
        .catch(() => {
          notify({ description: "Subscription failed", status: "error" })
        })
    })
  }

  return (
    <StripeContext.Provider
      value={{
        createSubscription,
        products: data.products,
        invoices: data.invoices,
      }}
    >
      <Elements stripe={stripePromise}>{children}</Elements>
    </StripeContext.Provider>
  )
}

export { StripeContextProvider }
