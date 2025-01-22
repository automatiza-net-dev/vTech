import styled from "styled-components";

export const DreReport = styled("section")`
  margin-bottom: 20px;
  
  .filters-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  form > div {
    display: flex;
    align-items: flex-end;
    gap: 20px;

    .conntent_form_infinity_forge {
      > div {
        min-width: 300px;
        display: flex;

        > div {
          width: 100%;

          .input_control {
            margin-bottom: 0;
          }
        }
      }
    }
  }
`;
