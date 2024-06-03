// @ts-nocheck
import styled from "styled-components";

export const Container = styled.section`
  width: 100%;
`;

export const SectionBox = styled.div`
  text-align: center;
  width: 40%;
  .sub-section {
    text-align: left;
    border: solid 0.1px var(--gray);
    border-radius: 5px;
    background-color: ${(props) =>
      props.type === "receipt" ? "#E0FFFF" : "#FFF0F5"};
  }
`;
