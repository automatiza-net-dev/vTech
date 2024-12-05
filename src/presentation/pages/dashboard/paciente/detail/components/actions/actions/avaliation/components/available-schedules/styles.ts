import styled from "styled-components";

export const AvailableSchedules = styled("div")`
  padding: 20px;

  .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;

    th,
    td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: center;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
    }

    tbody > tr {
      cursor: pointer;

      &:hover {
        background: #ccc;
      }
    }
  }

  .cancelButton {
    opacity: 0.9;
    background-color: ${(props) => props.theme.primaryColor};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    display: block;
    width: fit-content;
    margin: 0 auto;

    &:hover {
      opacity: 1;
    }
  }
`;
