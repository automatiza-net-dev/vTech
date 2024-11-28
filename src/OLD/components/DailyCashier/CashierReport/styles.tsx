import styled from "styled-components";

export const Container = styled.div`
  background-color: #ffffff;

  .custom-title {
    background: ${(props) => props.theme.primaryColor};
  }
`;
