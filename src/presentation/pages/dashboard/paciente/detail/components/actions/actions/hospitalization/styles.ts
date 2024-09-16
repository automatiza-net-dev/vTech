import styled from "styled-components";

export const HospitalizationForm = styled("div")`
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .footer-container {
    display: flex;
    justify-content: flex-end;
    button {
      background: ${(props) => props.theme.primaryColor};
    }
  }

  .print-section {
    display: none;
  }
`;
