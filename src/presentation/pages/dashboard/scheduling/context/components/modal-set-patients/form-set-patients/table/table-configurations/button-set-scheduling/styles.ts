import styled from "styled-components";

export const ButtonSetSchedulling = styled.div`
  width: 100%;
  max-width: 6.61vw;
  min-width: 110px;
  margin: 0 auto;

  button {
    width: 100%;
    padding: 0 15px;
    text-transform: uppercase;
    font-size: 13px;
    box-shadow: none;
    height: 30px;

    &:disabled {
      background-color: #dddcdc !important;
      color: #fff !important;
    }
  }
`;
