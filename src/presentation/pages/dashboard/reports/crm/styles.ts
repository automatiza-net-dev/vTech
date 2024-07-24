import styled from "styled-components";

export const CrmReports = styled("section")`
  font-size: 14px;

  .custom-label {
    display: flex;
  }

  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;

    .center-elem-margin {
      margin: 5px;
    }
  }

  footer {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .date-input-container {
    margin-top: 3px;
    display: flex;
    align-items: center;
  }

  button {
    max-width: 150px;
    margin: 0 0 5px auto;
  }
`;
