import { useEffect, ComponentType } from "react"

import { useAuth } from "../hooks/context"
import { IUser } from "../providers"

interface IProps {
  data?: any
  currentUser?: IUser
}

export const withAuthComponent = <T extends IProps>(
  Component: ComponentType<T>
) => {
  return (props: IProps) => {
    const { rehydrateUser } = useAuth()

    useEffect(() => {
      rehydrateUser(props?.currentUser)
    }, [])

    return <Component {...(props as T)} />
  }
}
