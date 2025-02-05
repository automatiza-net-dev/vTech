import styled from "styled-components";

export const AddBudget = styled("div")`
  width: 100%;
  min-width: 700px;

  h2 {
    margin-bottom: 20px;
    text-align: center;
  }

  .error-form {
    font-size: 15px;
  }

  .loading {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;
  }

  form {
    padding-bottom: 20px;
  }

  .expirationDate {
    width: 50%;
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
`;
