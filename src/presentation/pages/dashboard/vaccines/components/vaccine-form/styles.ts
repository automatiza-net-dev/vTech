import styled from "styled-components";

export const VaccineForm = styled("div")`
  button {
    background: ${(props) => props.theme.primaryColor} !important;
  }

  padding: 10px;
  min-width: 500px;
  max-width: 700px;

  footer {
    display: flex;
    justify-content: right;
  }
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    width: 100%;
  }
`;
