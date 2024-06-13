import styled from "styled-components";

export const AddSale = styled("div")`
  height: 100%;

  h2 {
    margin-bottom: 20px;
    text-align: center;
  }

  .error-form {
    font-size: 17px;
  }

  .expirationDate {
    .date_picker_container {
      background-color: transparent;
      border: 1px solid #ccc;

      > svg {
        fill: #979797;
      }

      .react-datepicker-wrapper {
        input {
          color: #111;
        }
      }
    }
  }

  .error {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    svg {
      height: 90px;
      width: auto;
      margin-bottom: 50px;
    }

    p {
      font-size: 18px;
    }
  }

  .loading {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  }
`;
