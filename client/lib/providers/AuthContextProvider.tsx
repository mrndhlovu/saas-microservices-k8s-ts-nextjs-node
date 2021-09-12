import router from "next/router"
import { useCallback, useEffect, useState } from "react"

import { AuthContext } from "../hooks/context"
import { ROUTES } from "../../util/constants"
import { IUIRequestError } from "./GlobalContextProvider"
import { clientRequest, IPasswordConfirmation } from "../../api"
import { IPowerUp } from "../../components/profile/powerups/PowerUps"

export interface IAccountFields {
  expired?: boolean
  expiresAt?: string
  id: string
  isTrial: boolean
  isVerified: boolean
  plan: string
  status: string
  email?: string
  customerId?: string
  powerUps?: IPowerUp[]
}

interface IUserBoardRoles {
  [key: string]: string[]
}

export interface IUser {
  avatar?: string
  bio?: string
  email: string
  firstname?: string
  initials?: string
  lastname?: string
  loginTypes?: "email" | "username"
  account: IAccountFields
  boardIds: string[]
  roles: IUserBoardRoles[]
  starred?: string[]
  username: string
  viewedRecent?: string[]
  multiFactorAuth: boolean
  permissionFlag: number
  id: string
  fullName: string
}

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<IUser>()

  const [authError, setAuthError] = useState<IUIRequestError | null>()

  const rehydrateUser = useCallback((newUser?: IUser) => {
    const authenticated = Boolean(newUser?.email)

    setUser(newUser)
    setIsAuthenticated(authenticated)

    if (!authenticated) return router.push(ROUTES.login)
  }, [])

  const signup = useCallback(async formData => {
    setLoading(true)

    await clientRequest
      .signupUser(formData)
      .then(() => {
        router.push(`/${ROUTES.verify}?isNew=true`)
      })
      .catch(error => {
        setAuthError(error.message)
      })
      .finally(() => {
        return setLoading(false)
      })
  }, [])

  const verifyUserPassword = async (formData: IPasswordConfirmation) => {
    const body = {
      ...formData,
      identifier: user.email,
    }
    return await clientRequest
      .verifyUserCredentials(body)
      .then(res => res.status)
      .catch(() => null)
      .finally(() => {
        setLoading(false)
      })
  }

  const login = useCallback(async formData => {
    setLoading(true)

    await clientRequest
      .loginUser(formData)
      .then(res => {
        if (res.data.multiFactorAuth) {
          router.push(`/${ROUTES.mfa}`)
        }
        return router.push(ROUTES.home)
      })
      .catch(error => {
        setAuthError(error.message)
      })
      .finally(() => {
        return setLoading(false)
      })
  }, [])

  const fetchUser = useCallback(async () => {
    await clientRequest
      .getCurrentUser()
      .then(res => rehydrateUser(res.data))
      .catch(() => null)
  }, [rehydrateUser])

  const verifyLogin = useCallback(async formData => {
    setLoading(true)

    await clientRequest
      .verifyMfaCode(formData)
      .then(() => {
        return router.push(ROUTES.home)
      })
      .catch(error => {
        setAuthError(error.message)
      })
      .finally(() => {
        return setLoading(false)
      })
  }, [])

  const refreshToken = useCallback(async () => {
    await clientRequest
      .refreshAuthToken()
      .then(res => res.data)
      .catch(() => rehydrateUser())
      .finally(() => {
        return setLoading(false)
      })
  }, [rehydrateUser])

  const dismissAuthError = () => setAuthError(null)

  const logout = useCallback(async () => {
    setLoading(true)

    await clientRequest
      .logoutUser()
      .then(() => {
        return router.replace(router.pathname, `/${ROUTES.login}`)
      })
      .catch(error => {
        setAuthError(error.message)
        rehydrateUser()
      })
      .finally(() => {
        return setLoading(false)
      })
  }, [rehydrateUser])

  useEffect(() => {
    return () => {
      return setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authError,
        dismissAuthError,
        fetchUser,
        isAuthenticated,
        loading,
        login,
        logout,
        refreshToken,
        rehydrateUser,
        signup,
        user,
        verifyLogin,
        verifyUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContextProvider }
