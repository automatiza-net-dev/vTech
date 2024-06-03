import styled from "styled-components";

export const SelectActiveTutor = styled.div`
  .open-vinc-tutor-button {
    background-color: transparent;
    border: 1px solid ${(props) => props.theme.primaryColor};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    padding: 2px;
    border-radius: 3px;

    svg {
      width: 100%;
      fill: ${(props) => props.theme.primaryColor};
    }
  }
`;
