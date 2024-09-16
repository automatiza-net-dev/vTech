import styled from "styled-components";

export const ActivitiesTable = styled.div`
  margin-top: 30px;

  > div,
  .total {
    border-right: 4px solid rgba(0, 0, 0, 0.09) !important;
  }

  .top-actions {
    margin: 0;
  }

  h3 {
    text-align: center;
    margin: 0;
    padding: 10px 0;
    background: ${(props) => props.theme.primaryColor};
    color: #fff;
  }

  tbody > tr:last-child {
    border-top: 6px solid #ccc;
  }
`;
