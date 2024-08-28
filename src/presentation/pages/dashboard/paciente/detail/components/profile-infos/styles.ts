import styled from "styled-components";

export const ProfileInfos = styled("div")`
  width: 100%;
  display: flex;
  align-items: flex-start;

  .details-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    width: 100%;
    margin-left: 42px;

    > div {
      border-radius: 5px;
      border: 1px solid rgb(225, 225, 225);
    }
  }
`;
