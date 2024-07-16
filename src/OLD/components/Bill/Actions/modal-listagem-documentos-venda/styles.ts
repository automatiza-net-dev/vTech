import styled from "styled-components";

export const ModalListagem = styled("section")`
  font-size: 14px;
  padding: 10px;
  th {
    padding: 10px;
  }

  td {
    padding: 10px;
  }

  section:nth-child(odd) {
    background-color: #808080;
    color: #fff;
  }

  th {
    background-color: #808080;
    color: #fff;
  }

  .custom-header {
    text-align: center;
    width: 100%;
  }

  tr:nth-child(even) {
    background-color: #cacaca;
    color: #000000;
  }

  tr:nth-child(odd) {
    color: #000000;
  }

  footer {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
`;
