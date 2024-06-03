// @ts-nocheck
import styled from "styled-components";

export const Container = styled.div`
  .custom-button {
    height: 44px;
    border-radius: 5px;
    background-color: ${process.env.client === "sancla"  ?"var(--orange-light-1)" : "var(--lo-blue)"};
  }
`;
