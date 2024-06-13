import styled from "styled-components";

export const TimelineContainer = styled.div`
  font-size: 16px;
  margin-top: 15px;
  padding: 20px;
  border: 1px solid #E1E1E1;

  .inf-tag {
    background-color: #e1e1e1;
    border-radius: 50px;
    padding: 0 10px;
    margin-right: 12px;
  }

  .hospitalization {
    background-color: #4bc0c0;
    color: #ffffff;
  }

  .medical-presc {
    background-color: #925be3;
    color: #ffffff;
  }

  .medical-presc-exec {
    background-color: #925be2;
    color: #ffffff;
  }

  .occurrence-tag {
    background-color: #5e2129;
    color: #ffffff;
  }

  .medical-report {
    background-color: #000080;
    color: #ffffff;
  }

  .release-hospitalization {
    background-color: #00bfff;
    color: #ffffff;
  }

  .end-hospitalization {
    background-color: #eead2d;
    color: #ffffff;
  }

  .desc-box {
    display: flex;
    section {
      width: 30%;
      display: flex;
      flex-direction: column;
      span {
        margin-top: 12px;
      }
    }
  }
`;

export const Container = styled.section``;
