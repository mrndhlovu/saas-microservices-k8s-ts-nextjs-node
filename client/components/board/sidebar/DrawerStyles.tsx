import styled from "styled-components"

export default styled.div``

export const ChangeBgWrapper = styled.div<{
  photos: string
  colors: string
}>`
  position: relative;
  height: 100%;
  flex-direction: column;
  display: flex;

  .loading-block {
    height: 500px;
  }

  .tiles-wrapper {
    display: flex;
    position: relative;
  }

  .tile-content {
    height: 84%;
    width: 100%;
    overflow-y: auto;

    grid-template-columns: 1fr 1fr;
    display: grid;
    gap: 5px;
  }

  .tiles-wrapper.custom {
    grid-template-columns: 1fr 1fr;
    display: grid;
    gap: 10px;

    .tile.custom {
      width: 100%;
    }
  }

  .tiles-wrapper.images {
    min-height: 100%;
    flex-direction: column;
  }

  .colors-wrapper {
    display: grid;
    position: relative;
    height: fit-content;
    width: 100%;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .tile {
    ${props => props.theme.mixins.flex("column")};
    cursor: pointer;
    float: left;
    padding: 0 4px;
    position: relative;
    text-align: center;
    width: 50%;

    input {
      display: none;
    }

    span {
      font-size: 14px;
    }
  }
  .tile-image,
  .tile-colors {
    border-radius: 8px;
    height: 96px;
    margin-bottom: 8px;
    width: 100%;
    background-color: #dfe1e6;
    background-size: cover;
  }

  .tile-image {
    background-image: url("${props => props.photos}");
  }
  .tile-colors {
    background-image: url("${props => props.colors}");
  }

  .tile.custom {
    background: #091e420a;
    height: 96px;
    border-radius: 8px;
  }

  h2 {
    margin-bottom: 10px;
  }

  *::-webkit-scrollbar {
    display: none;
  }
`

export const StyledUl = styled.ul<{
  boardBgColor: string
  boardBgImage: string
}>`
  li {
    padding: 6px 6px 6px 40px;
    position: relative;
    text-align: left;

    border-radius: 3px;
    font-weight: 600;
    line-height: 20px;
    text-decoration: none;
    cursor: pointer;

    display: flex;
    text-align: center;
    justify-content: flex-start;

    div {
      text-align: left;

      &span:first-child {
        font-weight: 600;
      }
      small {
        font-weight: lighter;
      }
    }

    &:hover {
      background-color: #e9e9e9ea;
    }

    .button-icon {
      font-size: 20px;
      height: 20px;
      left: 12px;
      line-height: 20px;
      position: absolute;
      top: 6px;
      width: 20px;

      .change-color {
        background-position: 50%;
        background-size: cover;
        border-radius: 3px;
        background-color: ${props => props.boardBgColor};
        background-image: url("${props => props.boardBgImage}");
        width: 20px;
        height: 20px;
      }
    }
  }
`
