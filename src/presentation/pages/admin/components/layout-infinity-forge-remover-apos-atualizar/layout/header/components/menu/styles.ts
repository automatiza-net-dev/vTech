import styled from 'styled-components'

export const DefaultMenuStyle = styled('aside')`
  position: block;
  width: 285px;
  padding: 25px 0 15px 0;
  border-right: 1px solid #e1e1e1;
  z-index: 8;
  background: #fff;
  transition: 0.3s;

  * {
    transition: all 0.2s;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin-top: 0;
    margin-bottom: clamp(10px, 0.75vw, 15px);
    background: #fff;

    &.submenu {
      width: fit-content;
    }

    & + & {
      margin-top: clamp(10px, 0.75vw, 15px);
    }

    * {
      color: ${(props) => props.theme.darkColor};
      text-decoration: none;
    }

    li:has(> ul > .active-page) {
      background: ${(props) => props.theme.darkColor};

      * {
        color: #fff;
      }
    }

    li {
      position: relative;
      border-radius: 5px;

      cursor: pointer;
      width: 100%;

      &:hover,
      &.open {
        background: ${(props) => props.theme.darkColor};

        * {
          color: #fff;
        }
      }

      svg {
        width: 100%;
        height: auto;
        fill: currentColor;
      }

      > span {
        display: grid;
        grid-template-columns: max-content 14px;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        height: 100%;
        height: clamp(34px, 2.08vw, 40px);

        > div {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .icon {
          display: flex;
          width: 20px;
          height: 20px;
        }

        .arrow {
          width: 7px !important;
          display: flex;
        }
      }

      &:hover {
        > ul {
          display: block;
        }
      }
    }
  }

  // Responsives

  @media only screen and (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-120%);
    transition: transform 0.3s;
    min-height: 100dvh;

    &.open {
      transform: translateX(0);
    }

    li.open {
      ul {
        display: block;
      }
    }
  }
`

export const SubMenu = styled.ul<{ $index: number }>`
  display: none;
  position: absolute;
  left: 100%;
  top: 0;
  border-radius: 5px;
  padding: 4px !important;
  z-index: 24;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition:
    background-color 0.3s,
    border-color 0.3s;
  width: 100%;

  * {
    color: ${(props) => props.theme.darkColor} !important;
  }

  li {
    &:hover {
      background: rgb(225, 225, 225) !important;
    }

    &.active-page {
      background: rgb(225, 225, 225) !important;
    }
  }

  @media only screen and (max-width: 1024px) {
    position: relative;
    box-shadow: none;
    border: none;
    border-radius: 0;
    inset: unset;
  }
`

export const Overlay = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 7;
`
