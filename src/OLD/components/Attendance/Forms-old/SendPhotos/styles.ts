import styled from "styled-components";

export const Container = styled.div`
  .upload-button {
    border: dashed 1px gray;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    :hover {
      color: var(--blue);
      .upload-icon {
        color: var(--blue);
      }
    }
  }
`;
