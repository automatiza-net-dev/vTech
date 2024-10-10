import styled from "styled-components";

export const Step2 = styled("div")`
  width: 100%;

  form {
    margin: 30px 0 10px;

    label {
      font-weight: 600 !important;
      color: #fff !important;
    }

    button {
      background: ${(props) => props.theme.primaryColor} !important;
    }

    > div > div:first-child {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      row-gap: 10px;
      column-gap: 10px;
    }

    > div > div:last-child {
      display: flex;
      gap: 10px;
    }
  }
`;
