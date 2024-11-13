import styled from "styled-components";

export const InputBirthday = styled("div")`
  display: flex;
  align-items: center;

  #birthDate_change {
    width: 30px;
    height: 30px;
  }

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
