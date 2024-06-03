import styled from "styled-components";

export const Sidebar = styled.nav`
  position: relative;
  box-shadow: 7px 0px 25px 0px rgba(0, 0, 0, 0.08);

  svg {
    fill: ${(props) => props.theme.primaryColor};
  }

  .block-bar {
    background-color: ${(props) => props.theme.primaryColor};
    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    border-radius: 100%;
    position: absolute;
    right: -12px;
    top: 21px;
    z-index: 4;
    cursor: pointer;
    transition: 0.3s;

    svg {
      width: 12px;
      fill: #fff;
    }
  }

  .block-bar:hover {
    background-color: ${(props) => props.theme.primaryColor};
    transition: 0.3s;
  }

  .menu-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-height: 100vh;
    position: relative;
    transition: 0.3s;
    background-color: #fff;
    overflow: hidden;
    padding: 40px 14px 10px;

    a {
      display: flex;
      min-width: 250px;
      align-items: center;
      gap: 12px;
      color: ${(props) => props.theme.primaryColor};
    }
  }
`;
