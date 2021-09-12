import React, { ReactChildren } from "react"
import { ThemeProvider as UITheme } from "styled-components"

import theme from "../../theme"
import GlobalStyles from "../../theme/GlobalStyles"

const ThemeProvider = ({ children }) => {
  return (
    <UITheme theme={theme}>
      <GlobalStyles />
      {children}
    </UITheme>
  )
}

export { ThemeProvider }
