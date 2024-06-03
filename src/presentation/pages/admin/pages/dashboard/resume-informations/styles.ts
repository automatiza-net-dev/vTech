import styled from "styled-components";

export const ResumeInformations = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 400px;

  .informations {
    background-color: rgb(25, 25, 112);
    border-radius: 8px;
    padding: 10px;
    flex-direction: column;
    display: flex;

    * {
      color: #fff;
    }

    .total-price {
      font-size: 20px;
      text-align: end;

      &.border {
        border-bottom: 1px solid #fff;
      }
    }

    .parcelas-box {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  }
`;
