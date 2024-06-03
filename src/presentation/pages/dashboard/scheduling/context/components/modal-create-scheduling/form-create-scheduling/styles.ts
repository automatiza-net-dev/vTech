import styled from "styled-components";

export const FormCreateScheduling = styled("div")`
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h2 {
      font-size: 17px;
      text-transform: uppercase;
    }

    button {
      height: 35px;
      font-size: 13px;
      padding-top: 7px;
    }
  }


  h3 {
    margin-bottom: 2px;
    color: #111;
    font-size: 14px;
    font-weight: 500;
  }

  .row {
    width: 100%;

    > div {
      width: 100%;
    }
  }

  form {
    button {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      border: 0;
      color: #fff;
      text-transform: uppercase;
      font-weight: 500;
      background-color: ${props => props.theme.primaryColor};
    }
  }
`;
