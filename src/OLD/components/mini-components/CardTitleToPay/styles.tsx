import styled, { css } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: solid 2px #a0a0a0;
  background-color: #ffffff;
  min-height: 120px;
  border-radius: 20px;
  padding: 15px;
  transition: all ease-in-out 0.25s;
  max-height: 300px;
  overflow-y: auto;

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two columns with equal width */
    column-gap: 10px; /* Adjust the gap between the columns as needed */
  }

  .totalText {
    text-align: right !important;
    margin: 0;
  }

  .supplierText {
    text-align: left !important;
  }

  .valueText {
    text-align: right !important;
  }
`;
