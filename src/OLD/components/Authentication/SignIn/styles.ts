// @ts-nocheck
import styled from "styled-components";

// tmp-style

export const Container = styled.div`
  background-image: ${({ host }) =>
    process.env.client === "sancla" ? 'url("/img/bg-sancla.jpg")' : "none"};
  padding: 40px 80px;
  min-height: 100vh;
  background-color: ${process.env.client === "liftone"
    ? "var(--lo-blue)"
    : process.env.client === "clinicas"
    ? "#7f7f7f"
    : "var(--orange-light-1)"};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 100px;

  font-size: 14px;

  h3 {
    color: #ffffff;
  }

  .left-side {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .border-radius {
    border-radius: 10px;
  }

  .uk-card {
    min-width: 450px;
  }

  .checkbox {
    display: flex;
    align-items: center;
    label {
      margin-left: 5px;
    }
    input {
      margin-top: 0px;
    }
  }
`;
