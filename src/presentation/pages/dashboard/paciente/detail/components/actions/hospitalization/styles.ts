import styled from "styled-components";

import { Button } from "infinity-forge";

export const Hospitalization = styled(Button)``;

export const HospitalizationContent = styled("div")`
  .row {
    width: 100%;
    align-items: center;

    > div {
      flex: 1;
      width: 100%;
    }

    &:nth-child(2) {
      > div:last-child {
        max-width: 180px;
      }
    }
  }

  textarea {
    max-height: 98px;
    resize: none;
  }
`;
