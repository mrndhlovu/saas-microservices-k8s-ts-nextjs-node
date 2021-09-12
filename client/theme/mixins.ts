import { css } from "styled-components"

const grid = (placement = "center", align = "center") => css`
  display: grid;
  place-items: ${placement};
  align-items: ${align};
`

const flex = (direction = "row", justify = "center", align = "center") => css`
  display: flex;
  justify-content: ${justify};
  align-items: ${align};
  flex-direction: ${direction};
`

const textHoverEffect = (color?: string) => css`
  &:hover {
    color: ${color};
    transition-duration: 500ms;
    transition-property: color;
    transition-timing-function: ease-in-out;
  }
`

const transitionEffect = (property?: string) => css`
  transition: 500ms;
  transition-property: ${property};
  transition-timing-function: ease-in-out;
`

const lineClamp = (numberOfLines: number) => css`
  overflow: hidden;
  text-overflow: -o-ellipsis-lastline;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${numberOfLines};
  -webkit-box-orient: vertical;
`

const flexGap = (gap?: string, element?: string) =>
  element
    ? css`
        ${element} {
          margin: ${gap};
        }
        @supports (gap: ${gap}) {
          ${element} {
            margin: 0;
          }
          gap: ${gap};
        }
      `
    : css`
        & > * {
          margin: ${gap};
        }
        @supports (grid-gap: ${gap}) {
          & > * {
            margin: 0;
          }
          grid-gap: ${gap};
        }
      `

const placeholderColor = (placeholderColor: string) => css`
  &::-webkit-input-placeholder {
    color: ${placeholderColor};
  }
  &:-moz-placeholder {
    color: ${placeholderColor};
  }
  &::-moz-placeholder {
    color: ${placeholderColor};
  }
  &:-ms-input-placeholder {
    color: ${placeholderColor};
  }
`
const clearFix = () => css`
  &::after {
    content: "";
    clear: both;
    display: table;
  }
`

const gradientColor = (value: string, deg: number) => css`
  background: ${value === "a"
    ? `linear-gradient($deg#${deg}, #f71595 0%, #ed560e 62%, #ff9600 100%)`
    : value === "b"
    ? `linear-gradient($deg#${deg}, rgb(251, 110, 57) 12%, rgb(252, 85, 93) 50%, rgb(253, 59, 128) 91%)`
    : `linear-gradient($deg#${deg}, rgb(40, 172, 225) 12%, rgb(81, 204, 231) 50%, rgb(122, 235, 236) 91%)`};
  background-clip: text;
  text-fill-color: transparent;
`

const gradientBg = (value: string, deg: number) => css`
  background: ${value === "a"
    ? `linear-gradient($deg#${deg}, #ffffff 0%, transparent 95%)`
    : value === "b"
    ? `linear-gradient($deg#${deg}, rgba(223, 32, 32, 1) 0%, rgba(0, 0, 0, 0.6) 36%, rgba(0, 0, 0, 0.3) 100%)`
    : `linear-gradient($deg#${deg}, rgb(40, 172, 225) 12%, rgb(81, 204, 231) 50%, rgb(122, 235, 236) 91%)`};
`

export default {
  grid,
  flex,
  textHoverEffect,
  transitionEffect,
  lineClamp,
  flexGap,
  clearFix,
  gradientBg,
  gradientColor,
  placeholderColor,
}
