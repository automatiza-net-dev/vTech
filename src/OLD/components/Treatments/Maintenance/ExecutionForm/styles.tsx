import styled from "styled-components";

export const Container = styled.section`
  .fields-box, .custom-head {
    display: grid;
    margin-top: 10px;
    grid-template-columns: 2fr 2fr 2fr 2fr 2fr 1fr 
  }

  .custom-head {
    text-align: center;
  }

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
