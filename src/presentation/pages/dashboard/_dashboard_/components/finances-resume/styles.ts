import styled from "styled-components";

export const FinancesResume = styled("div")`
  margin-top: 20px;
  > div {
    display: grid;
    width: 100%;
    gap: 20px;

    grid-template-columns: repeat(4, 1fr);
    section {
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      font-size: 14px;
      padding: 10px;
      width: 100%;

      .desc-items, .title-header {
        display: flex;
        justify-content: space-between;
      }
      .desc-items {
        border-top: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
        padding: 5px;
      }
    }
  }

  @media only screen and (max-width: 1400px) {
    > div {
    grid-template-columns: repeat(3, 1fr);
    }
  }
`;
