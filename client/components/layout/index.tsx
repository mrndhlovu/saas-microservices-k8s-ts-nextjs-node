import { useEffect, useState } from "react"

import { useAuth, useGlobalState } from "../../lib/hooks/context"
import Header from "../header/Header"
import ModeSwitch from "./ModeSwitch"

export const siteTitle = "Trello clone"

const Layout = ({ children }) => {
  const { darkMode } = useGlobalState()
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    darkMode
      ? document.body.classList.add("dark-mode")
      : document.body.classList.remove("dark-mode")
  }, [darkMode])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="layout">
      <div className="layout-children">
        {isAuthenticated && <Header />}

        {children}
      </div>
      {mounted && <ModeSwitch />}
    </div>
  )
}

export default Layout
