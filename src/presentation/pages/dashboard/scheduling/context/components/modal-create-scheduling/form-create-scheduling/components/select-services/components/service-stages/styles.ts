import styled from "styled-components";

export const ServiceStages = styled("div")`
  .radio-box {
    gap: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    h3 {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .content {
      display: flex;
      margin-bottom: 15px;
      width: 100%;
    }

    .input-box {
      width: 20px;
      display: flex
;
    align-items: center;
    }

    label {
      width: 200px;
      margin-bottom: 0;
    }
    
    .information {
      width: 175px;
    }

    .text {
      display: flex;
      gap: 30px;
      font-size: 14px;
    }
  }
`;
