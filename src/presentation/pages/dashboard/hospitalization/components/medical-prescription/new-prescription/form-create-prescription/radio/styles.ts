import styled from "styled-components";

export const InputRadio = styled('div')`
  &:has(input[readOnly]) {
    label,
    input {
    }
  }

  input:read-only, label {cursor: pointer !important;}

  .list-radios label {
    cursor: pointer;
    display: block;
    margin-bottom: 8px;
  }

  .list-radios input[type='radio'] {
    margin-right: 6px;
  }
`