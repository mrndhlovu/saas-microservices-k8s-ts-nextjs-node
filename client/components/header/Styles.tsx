import styled from "styled-components"

interface IHeaderStyles {
  isTransParent?: boolean
}

export default styled.header<IHeaderStyles>`
  background-color: ${({ isTransParent, theme }) =>
    isTransParent ? "#00000036" : theme.colors.trello};
  z-index: 100;
  height: 37px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0px 4px;

  .dropdown {
    border: none;
    padding: 0;
    margin: 0;
    background-color: transparent !important;
    color: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
  }

  .header {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    position: relative;
    padding: 8px 4px;

    &-left-content {
      height: 100%;
      width: 100%;
    }

    &-logo-content {
      width: 100%;
      .logo {
        ${props => props.theme.mixins.flex()};
      }
    }

    &-logo-text {
      position: absolute;
      font-weight: 700;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -45%);
      text-decoration: none;
      color: #ffffff;
      span {
        padding-top: 2px;
        margin-left: 5px;
      }
    }

    &-right-content {
      height: 100%;
      width: 100%;
    }

    &-left-icon-wrapper {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 100%;
      display: flex;
      place-items: center;
    }

    &-search-dropdown-button {
      ${props => props.theme.mixins.transitionEffect()};
      @media ${props => props.theme.device.mobileLg} {
        display: none;
      }

      @media ${props => props.theme.device.mobileSm} {
        display: none;
      }
    }

    &-search-content {
      position: relative;

      label {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      input {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 3px;
        border: none;
        box-shadow: none;
        box-sizing: border-box;
        float: left;
        font-size: 14px;
        height: 32px;
        line-height: 19px;
        margin: 0;
        outline: none;
        padding-left: 8px;
        padding-right: 30px;
        transition: width 150ms;
        width: 184px;

        &:focus {
          background-color: #ffffff;
          color: #5e6c84;
        }
        ${props => props.theme.mixins.placeholderColor("#fff")};
      }

      span {
        color: #ffffff;
        position: absolute;
        right: 2px;
        font-weight: 700;
        line-height: 16px;
        margin-top: 12px;
        margin-bottom: 4px;
        display: block;

        svg {
          position: absolute;
          color: #ffffff;
          bottom: 50%;
          left: -25px;
          transform: translateY(80%);
          font-size: 18px;
        }
      }
    }

    &-right-icon-wrapper {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 100%;
      display: flex;
      gap: 1px;
      place-items: center;
    }

    &-auth-button {
      background-color: ${props => props.theme.colors.whatsapp};
      border-radius: 50%;
      position: relative;
      outline: 0;
      border: none;
      height: 30px;
      width: 30px;
    }

    &-auth-user-icon {
      ${props => props.theme.styles.absoluteCenter};
      color: #ffffff;
    }

    &-button-text {
      font-size: 1rem;
      color: ${props => props.theme.colors.bgDark};
      position: absolute;
      font-weight: 500;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    &-board-button {
      border-radius: 3px;
      border: 0;
      text-decoration: none;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.3);
      box-shadow: none;
      color: #ffffff;
      display: flex;
      font-weight: bold;
      height: 32px;
      line-height: 32px;
      margin: 0 4px 0 0;
      padding: 0;
      white-space: nowrap;

      padding: 0 8px;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;

      .header-board-text {
        ${props => props.theme.mixins.transitionEffect()};
        display: block;
      }

      @media ${props => props.theme.device.tablet} {
        ${props => props.theme.mixins.transitionEffect()};

        .header-board-text {
          display: none;
        }
      }

      @media ${props => props.theme.device.mobileLg} {
        .header-board-text {
          display: none;
        }
      }
    }

    &-button {
      border-radius: 3px;
      border: 0;
      text-decoration: none;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.3);
      box-shadow: none;
      color: #ffffff;
      display: flex;
      font-weight: bold;
      height: 32px;
      width: 32px;
      line-height: 32px;
      margin: 0 4px 0 0;
      padding: 0;
      white-space: nowrap;

      span {
        display: flex;
        width: 32px;
        justify-content: center;
        align-items: center;
        margin: 0;
      }

      svg {
        font-size: calc(1rem + 3px);
      }
    }

    @media ${props => props.theme.device.mobileLg} {
      min-width: 400px;
      padding: 0;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`
