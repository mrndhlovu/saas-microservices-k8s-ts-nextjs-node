import { createContext, useContext } from "react"
import {
  ILoginCredentials,
  IPasswordConfirmation,
  ISignupCredentials,
} from "../../api"
import {
  IStripeInvoice,
  IStripeProduct,
  IToastProps,
  IUIRequestError,
  IUser,
} from "../providers"

interface IDefaultGlobalState {
  darkMode: boolean
  handleModeChange: () => void
  notify: (option: IToastProps) => void
}

interface IDefaultAuthContext {
  loading: boolean
  user?: IUser
  isAuthenticated: boolean
  rehydrateUser: (newUser?: IUser) => void
  logout: () => {} | void | null
  login: (formData: ILoginCredentials) => Promise<void>
  dismissAuthError: () => void
  signup: (formData: ISignupCredentials) => Promise<void>
  refreshToken: () => {} | void | null
  fetchUser: () => Promise<void>
  authError: undefined | IUIRequestError
  verifyLogin: (formData: { token: string }) => Promise<void>
  verifyUserPassword: (data: IPasswordConfirmation) => Promise<number | null>
}

export interface ICardDetails {
  productId?: string
  priceId?: string
  source?: string
  currency?: "usd" | "eur"
  customerId?: string
  amount?: string
  paymentMethodId?: string
  plan?: string
}

interface IStripeContext {
  createSubscription: (cardData: ICardDetails) => any
  products?: IStripeProduct[]
  invoices?: IStripeInvoice[]
}

export const GlobalContext = createContext<IDefaultGlobalState>(
  {} as IDefaultGlobalState
)

export const ThemeContext = createContext(null)
export const StripeContext = createContext<IStripeContext>({} as IStripeContext)
export const AuthContext = createContext<IDefaultAuthContext>(
  {} as IDefaultAuthContext
)

export const useGlobalState = () => useContext(GlobalContext)
export const useAuth = () => useContext(AuthContext)
export const useStripeContext = () => useContext(StripeContext)
