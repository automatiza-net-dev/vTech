import styled from "styled-components";

export const FaturamentoAgrupado = styled("div")`
  border-radius: 5px;
  background: #b9e2fd;
  color: #2b2b2b;
  padding: clamp(8px, 0.78vw, 15px);
  width: 100%;

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 4px;
    width: 100%;
    padding-bottom: 13px;
    margin-bottom: 10px;
    border-bottom: 1px solid #36a2eb;

    h3 {
      font-weight: 400;
    }

    h3,
    p {
      font-size: 18px;
    }
  }

  > p {
    font-size: 16px;
    margin: 0;
    text-align: end;
  }

  @media only screen and (max-width: 1600px) {
    .top {
      padding-bottom: 10px;
      margin-bottom: 8px;

      h3,
      p {
        font-size: 17px;
      }
    }

    > p {
      font-size: 15px;
    }
  }

  @media only screen and (max-width: 1400px) {
    .top {
      h3,
      p {
        font-size: 16px;
      }
    }

    > p {
      font-size: 14px;
    }
  }
`;
