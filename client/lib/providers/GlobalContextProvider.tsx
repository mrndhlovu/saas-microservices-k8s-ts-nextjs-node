import { useToast } from "@chakra-ui/react"
import { useCallback } from "react"

import { GlobalContext } from "../hooks/context"
import { useLocalStorage } from "../hooks"

export type IUIRequestError = string[]

export interface IToastProps {
  title?: string
  description: string | string[]
  status?: "info" | "warning" | "success" | "error"
  placement?:
    | "top-right"
    | "top"
    | "top-left"
    | "bottom-left"
    | "bottom-right"
    | "bottom"
}

export interface IThemeMode {
  darkMode: boolean
}

const GlobalContextProvider = ({ children }) => {
  const toast = useToast()
  const [theme, setTheme] = useLocalStorage<string, IThemeMode>("theme", {
    darkMode: false,
  })

  const handleModeChange = () => {
    return setTheme((prev: IThemeMode) => {
      return { ...prev, darkMode: !prev?.darkMode }
    })
  }

  const notify = useCallback(
    (msg: IToastProps) => {
      const data = {
        title: msg.title,
        status: msg.status || "success",
        duration: 9000,
        isClosable: true,
        position: msg.placement || "bottom",
      }

      if (typeof msg.description === "string") {
        return toast({
          ...data,
          description: msg.description,
        })
      }

      return msg.description.map(desc =>
        toast({
          ...data,
          description: desc,
        })
      )
    },
    [toast]
  )

  return (
    <GlobalContext.Provider
      value={{
        handleModeChange,
        darkMode: theme?.darkMode,
        notify,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export { GlobalContextProvider }
