import styled from "styled-components";

export const IndicatorTable = styled.section`
  width: 100%;
  margin-top: 40px;

  .tables {
    width: 100%;
    display: flex;
    margin-top: 20px;

    > div {
      width: 100%;

      thead {
        height: 90.5px;
      }

      > div {
        border-radius: 0;
      }

      > h3 {
        text-align: center;
        margin: 0;
        padding: 10px 0;
        background: ${(props) => props.theme.primaryColor};
        color: #fff;
      }

      .top-actions {
        margin: 0;
      }

      .total {
        display: flex;
        align-items: center;
        height: 45px;
        border: 1px solid rgba(224, 224, 224, 1);
        padding: 0 15px;
        color: #000000de;
        font-size: 13px;
        font-weight: 600;
      }
    }
  }
`;
