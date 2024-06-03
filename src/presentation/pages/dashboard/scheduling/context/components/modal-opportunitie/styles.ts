import styled from "styled-components";

export const ModalOpportunitie = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;

  thead {
    td {
      font-weight: 700;
      text-transform: uppercase;
    }
  }

  tbody {
    tr {
      height: 35px;
      border-bottom: 1px solid #000;
      td {
        padding-top: 10px;
        padding-bottom: 10px;
      }
    }
  }

  button {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: ${(props) => props.theme.primaryColor};
    text-transform: uppercase;
    color: #fff;
    border-radius: 4px;
    font-weight: 700;
  }
`;
