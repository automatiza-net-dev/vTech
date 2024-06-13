import { styled } from "styled-components";

export const CashiersResumeCard = styled("div")`
  margin-top: 20px;
  
  > div {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    section {
      border: 1px solid #e1e1e1;
      border-radius: 5px;
      font-size: 14px;
      padding: 10px;
      width: 100%;
      height: 200px;
      overflow: auto;

      .infos {
        display: grid;
        grid-template-columns: 1fr 2fr;
        border-top: 1px solid #e1e1e1;
        border-bottom: 1px solid #e1e1e1;
        padding: 5px;
        width: 100%;
      }
    }
  }

  @media only screen and (max-width: 1400px) {
    > div {
    grid-template-columns: repeat(3, 1fr);
    }
  }
`;
