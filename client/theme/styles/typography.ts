import { css } from "styled-components"

const typography = css`
  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #383838;
  }

  *::-webkit-scrollbar {
    width: 5px;
    background-color: #383838;
  }

  *::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #6b6b6b;
  }

  html {
    overflow: hidden;
    overflow-y: auto;
  }

  body {
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: ${props => props.theme.variables.body};
    font-family: ${props => props.theme.fonts.secondary} !important;
    color: ${props => props.theme.colors.border};
    font-weight: 400;
    background: ${props => props.theme.colors.bgBody};

    @media ${props => props.theme.device.tablet} {
      font-size: calc(${props => props.theme.variables.body} + 2);
    }

    @media ${props => props.theme.device.mobileLg} {
      font-size: calc(${props => props.theme.variables.body} + 1);
    }
  }

  img {
    max-width: 100%;
  }
  ${props => props.theme.mixins.placeholderColor(props.theme.colors.body)};

  .input-container {
    position: relative;
    margin: 5px 0 15px;
    cursor: text;
    max-width: 100%;
    transition: background-color 0.2s ease-in-out 0s,
      border-color 0.2s ease-in-out 0s;
    overflow-wrap: break-word;

    input {
      background-color: transparent;
      border-radius: 3px;
      border-width: 2px;
      border-style: solid;
      box-sizing: border-box;
      color: inherit;
      cursor: inherit;
      font-size: 14px;
      min-width: 0px;
      outline: none;
      width: 100%;
      line-height: 1.42857;
      height: 39px;
      padding-left: 10px;
    }

    .input-feedback {
      position: absolute;
      bottom: -12px;
      left: 0;
      font-size: 10px;
      margin-top: 0;
      font-weight: 700;
      color: ${props => props.theme.colors.error};
    }
  }

  a,
  button {
    cursor: pointer;
  }

  button {
    border-radius: 3px;
  }
`

export default typography
