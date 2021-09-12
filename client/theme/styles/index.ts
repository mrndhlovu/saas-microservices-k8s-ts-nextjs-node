import { css } from "styled-components"

import darkMode from "./dark-mode"
import typography from "./typography"
import reset from "./reset"
import utilities from "./utilities"

const absoluteCenter = css`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const cardBoxShadow = css`
  box-shadow: 0 1px 0 #091e4240;
`

export default {
  darkMode,
  typography,
  reset,
  utilities,
  absoluteCenter,
  cardBoxShadow,
}
