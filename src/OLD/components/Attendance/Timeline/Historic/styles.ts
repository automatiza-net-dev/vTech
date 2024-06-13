import styled from "styled-components";

export const PatientHistoric = styled("div")`
  display: flex;
  flex-wrap: wrap;

  .item-card {
    padding: 20px;
    width: 30%;
    border-radius: 5px;
    border: 1px solid #e1e1e1;
    margin: 15px;

    .inf-tag {
      margin-right: 12px;
      font-size: 14px;
      padding: 0px 10px;
      border-radius: 50px;
      background-color: #e1e1e1;
    }

    .desc-box {
      font-size: 16px;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      gap: 12px;
      .cancel-info {
        font-size: 14px;
        padding-left: 5px;
        display: flex;
        flex-direction: column;
        section {
          margin-top: 5px;
          span {
            margin-right: 10px;
          }
        }
      }
    }
  }
`;
