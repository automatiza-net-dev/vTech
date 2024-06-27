import styled from "styled-components";

export const VaccineForm = styled("div")`
  padding: 10px;
  min-width: 500px;

  footer {
    display: flex;
    justify-content: right;
  }
  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
`;
