import styled from "styled-components";

export const CrmDashboard = styled("section")`
  display: flex;
  .charts-container {
    width: 80%;
    section {
      text-align: center;
      .charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-top: 50px;
      }
      .svg-item {
        display: block;
        height: 33%;
        text-align: left;
        h3 {
          margin-left: 10%;
        }
      }
    }
  }
`;
