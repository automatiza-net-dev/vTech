import styled from "styled-components";

export const ServiceStages = styled("div")`
  .radio-box {
    gap: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 10px;
    margin-left: 20px;
    .content {
      display: flex;
    }

    .input-box {
      width: 10%;
    }
    label {
      width: 80%;
    }
  }
`;
