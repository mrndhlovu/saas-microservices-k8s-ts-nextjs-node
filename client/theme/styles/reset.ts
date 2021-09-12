import { css } from "styled-components"

const reset = css`
  html {
    color: ${props => props.theme.colors.border};
  }

  .layout {
    height: 100vh;
    width: 100vw;
    background-color: ${props => props.theme.colors.bgLight};

    &-children {
      height: 100%;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      position: relative;
    }
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  input,
  textarea,
  button {
    border-radius: 3px !important;
  }

  textarea {
    resize: vertical;
  }

  .chakra-modal__overlay,
  .chakra-modal__content-container {
    z-index: 1;
  }

  .browserupgrade {
    margin: 0.2em 0;
    background: #ccc;
    color: #000;
    padding: 0.2em 0;
  }

  .hidden {
    display: none !important;
  }

  .card-editor {
    z-index: 20;
  }

  .card-editor-modal {
    background-color: transparent;
  }

  .card-editor-modal-content {
    background-color: transparent;
    z-index: 0;

    .close-button {
      border-color: none;
    }

    svg {
      color: #fff;
    }
  }

  .card-editor-overlay {
    z-index: 0;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100vw;
    height: 100vh;
    background-color: #00000070;
  }

  .visuallyhidden {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  .visuallyhidden.focusable:active,
  .visuallyhidden.focusable:focus {
    clip: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    position: static;
    width: auto;
    white-space: inherit;
  }

  .invisible {
    visibility: hidden;
  }

  .clearfix:before,
  .clearfix:after {
    content: " ";
    display: table;
  }

  .clearfix:after {
    clear: both;
  }

  @media only screen and (min-width: 35em) {
  }

  @media print,
    (-webkit-min-device-pixel-ratio: 1.25),
    (min-resolution: 1.25dppx),
    (min-resolution: 120dpi) {
  }

  @media print {
    *,
    *:before,
    *:after {
      background: transparent !important;
      color: #000 !important;
      -webkit-box-shadow: none !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    a,
    a:visited {
      text-decoration: underline;
    }

    a[href]:after {
      content: " (" attr(href) ")";
    }

    abbr[title]:after {
      content: " (" attr(title) ")";
    }

    a[href^="#"]:after,
    a[href^="javascript:"]:after {
      content: "";
    }

    pre {
      white-space: pre-wrap !important;
    }

    pre,
    blockquote {
      border: 1px solid #999;
      page-break-inside: avoid;
    }

    thead {
      display: table-header-group;
    }

    tr,
    img {
      page-break-inside: avoid;
    }

    p,
    h2,
    h3 {
      orphans: 3;
      widows: 3;
    }

    h2,
    h3 {
      page-break-after: avoid;
    }
  }
`

export default reset
