import styled from "styled-components";

export const Container = styled.section`
  .pointer-icon {
    cursor: pointer;
  }

  .active-edit-icon {
    color: var(--darkBlue);
  }

  .confirm-icon {
    color: #3cb371;
  }

  .cancel-icon {
    color: var(--red);
  }

  .inactive-icon {
    color: #a9a9a9;
    cursor: not-allowed;
  }
`;
