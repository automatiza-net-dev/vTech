import styled from "styled-components";

export const ContactItem = styled("div")`
  display: grid;
  grid-template-columns: 1fr 2.5fr 2fr 1.2fr;
  gap: 20px;
  margin-bottom: 20px;

  .main {
    min-width: 20px;
    background: transparent;
    border: 0;
    padding: 0;

    svg {
      height: auto;
      min-width: inherit;
    }
  }


 > div:last-child {
    display: flex;
    align-items: center;
    gap: 15px;
    padding-top: 30px;

    button {
      background-color: transparent;
      border: 0;
      padding: 0;
    }
  }

  .input_control {
    margin-bottom: 0;
  }
`;
