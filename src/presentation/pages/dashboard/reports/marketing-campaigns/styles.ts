import styled from "styled-components";

export const MarketingCampaignsReports = styled("section")`
  .filter-container {
    gap: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .form-button button {
    background: ${(props) => props.theme.primaryColor};
  }
`;
