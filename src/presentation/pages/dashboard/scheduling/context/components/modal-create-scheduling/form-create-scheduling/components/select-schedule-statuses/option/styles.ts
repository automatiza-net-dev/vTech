import styled from "styled-components";

export const Option = styled("div")`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 5px;
  height: 37px;

  .ball {
    height: 12px;
    width: 12px;
    border-radius: 100%;
  }

  span {
    font-size: 14px;
    color: #111;
  }

  &:hover {
    background-color: #deebff;
  }
`;
