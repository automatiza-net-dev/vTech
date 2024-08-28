import styled from "styled-components";

export const InputBirthday = styled("div")`
  display: flex;
  align-items: center;

  .select_year {
    display: flex;
    gap: 18px;

    > * {
      width: 31%;
      > div {
        width: 100%;
      }
    }
  }
`;
