import styled from "styled-components"

export const InputCourtesy = styled("div")`
    display: flex;
    align-items: flex-start;
    gap: 25px;
    div {
      width: 13px;
    }
    .delete {
      width: 13px;
      height: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      background-color: #e1e1e1;
      border: 0;
      border-radius: 5px;

      svg {
        width: 16px;
        height: auto;
        fill: #828282;

        &:hover {
          fill: red;
        }
      }
    }
`