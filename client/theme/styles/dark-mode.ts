import { css } from "styled-components"

const darkStyles = css`
  .dark-mode {
    *::-webkit-scrollbar-track {
      background-color: #383838;
    }

    *::-webkit-scrollbar {
      background-color: #383838;
    }

    *::-webkit-scrollbar-thumb {
      background-color: #6b6b6b;
    }

    .layout {
      background-color: ${props => props.theme.colors.bgDark};
    }

    ${props => props.theme.mixins.placeholderColor(props.theme.colors.body)};

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    button,
    input,
    select,
    textarea,
    span {
      color: ${props => props.theme.colors.bgLight}!important;
    }

    a {
      color: ${props => props.theme.colors.twitter}!important;
    }

    ::-moz-selection {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.bgLight};
    }

    ::-ms-selection {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.bgLight};
    }

    ::-o-selection {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.bgLight};
    }

    ::selection {
      background: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.bgLight};
    }

    input,
    button,
    select,
    textarea {
      border-color: ${props => props.theme.colors.lightBorder};

      ${props =>
        props.theme.mixins.placeholderColor(props.theme.colors.borderLight)};
    }

    blockquote {
      border-color: ${props => props.theme.colors.primary};
      background: darken(${props => props.theme.colors.border}, 5);

      footer {
        a {
          color: ${props => props.theme.colors.primary};

          &:hover {
            color: ${props => props.theme.colors.primary};
          }
        }
      }
    }

    .mode-switch {
      .icon {
        display: inline-block;
        vertical-align: middle;
        line-height: 1;
        margin-right: 5px;
        svg {
          fill: ${props => props.theme.colors.amazon};

          & > * {
            fill: ${props => props.theme.colors.amazon};
          }
        }
      }

      .mode-switch-button {
        background: ${props => props.theme.colors.border};
      }
    }

    .auth-form-wrapper {
      section {
        background-color: ${props => props.theme.colors.bgDark};
        box-shadow: ${props => props.theme.colors.lightBoxShadowBorder};
      }
    }

    .create-board {
      box-shadow: ${props => props.theme.colors.lightBoxShadowBorder};

      svg {
        color: #fff;
      }
    }
  }
`

export default darkStyles
