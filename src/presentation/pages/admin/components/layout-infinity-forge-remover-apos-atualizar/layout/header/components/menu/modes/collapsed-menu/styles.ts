import styled from 'styled-components'
import { DefaultMenuStyle } from '../../styles'

export const CollapsedMenu = styled(DefaultMenuStyle)`
  padding: 41px 0 15px 0;
  z-index: 99;
  width: 65px;
  min-width: 65px;
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0;

  .ghost {
    width: 65px;
  }

  &.open {
    width: 240px !important;
    transition: 0.3s;

    .expand {
      svg {
        transform: rotate(180deg);
      }
    }
  }

  .expand {
    position: absolute;
    top: 10px;
    right: -12px;
    padding: 8px;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    background-color: ${(props) => props.theme.primaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    z-index: 56;

    svg {
      width: 100%;
      fill: #fff;
      height: auto;
    }
  }

  &:not(.open) > ul {
    > li {
      > span {
        grid-template-columns: 1fr !important;

        > div {
          width: fit-content;
          margin: auto;
        }

        a,
        .arrow {
          display: none;
        }
      }
    }

    ul {
      min-width: max-content;
      width: 240px;
    }
  }
`
