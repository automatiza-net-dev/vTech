import styled from "styled-components";

export const Actions = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;

  button,
  a,
  .button {
    font-size: 14px;
    font-weight: 400;
    height: 40px;

    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
    background-color: ${(props) => props.theme.primaryColor};
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.primaryColor} !important;

    &:hover,
    .active {
      background-color: #fff !important;
      color: ${(props) => props.theme.primaryColor} !important;

      svg {
        fill: ${(props) => props.theme.primaryColor};
      }
    }

    div {
      display: flex;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
  }

  .start-attendance {
    width: 200px !important;
  }

  .item {
    width: 160px !important;
    height: 40px !important;
    font-size: 14px !important;
    display: flex !important;
    align-items: center !important;
    gap: 5px !important;

    svg {
      width: 14px;
      height: auto;
    }
  }

  svg {
    height: 18px;
    width: auto;
    fill: #fff;
  }

  .box {
    display: flex;
    align-items: center;
    gap: 15px;

    button,
    a,
    .button {
      width: 160px;
    }
  }
`;
