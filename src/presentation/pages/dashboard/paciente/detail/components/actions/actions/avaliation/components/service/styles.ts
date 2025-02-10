import styled from "styled-components";

export const Service = styled("div")`

  .form-button.sticky {
    z-index: 9;
  }

  .form-button {
    display: flex;
    gap: 20px;
    justify-content: flex-end;
    margin-top: 20px;
    width: 100%;
  }

  .internal_observations {
    margin-bottom: 20px;

    h2 {
      font-size: 15px;
      font-weight: 500;
    }

    .content.show {
      margin-top: 10px;
    }
  }

  .button_new_budget {
    max-width: 200px;
    margin-bottom: 20px;
    margin-left: auto;

    > div {
      height: 35px;
      width: 100%;

      button {
        width: 100%;
        height: inherit;
      }
    }
  }
`;
