import styled from "styled-components";

export const Container = styled.section`
  height: 500px;
  overflow-y: scroll;
  .card-box {
    cursor: pointer;
    :hover {
      border: dashed var(--blue) 0.5px;
    }
  }
`;