import styled from "styled-components";

export const MenuItem = styled.nav`
  width: 100%;

  .principal {
    padding: 12px 5px 12px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    color: #fff;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    font-size: 14px;
    text-decoration: unset;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;

      svg {
        width: 18px;
      }

      .arrow {
        svg {
          width: 10px;
        }
      }
    }
  }

  .arrow.active {
    transform: rotate(-90deg) !important;
  }

  .submenus {
    background-color: ${(props) => props.theme.palette.primary.light + "1a"};
    padding: 0;
    display: flex;
    flex-direction: column;
    font-size: 13px;
    height: 0;
    overflow: hidden;
    transition: 0.3s;

    a {
      color: #fff;
      display: inline-block;
      padding: 4px;
    }
  }

  .submenus.active {
    height: max-content;
    padding: 7px 10px;
    transition: 0.3s;
  }

  .principal:hover {
    background-color: ${(props) => props.theme.primaryColor + "1a"};
  }
`;
