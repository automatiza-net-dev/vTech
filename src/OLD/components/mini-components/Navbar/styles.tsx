// @ts-nocheck
import styled, { css } from "styled-components";

export const Container = styled.div`
  .logo-container {
    margin-bottom: 50px;
  }
  .icon-container {
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    margin-bottom: 30px;
    transition: all 0.3s ease-in-out;

    svg {
      path {
        fill: var(--darkBlue);
      }
    }

    &:hover {
      cursor: pointer;
      background-color: var(--darkBlue);
      svg {
        path {
          fill: #fff;
        }
      }
    }
  }

  .profile-info {
    display: flex;
    gap: 4vw;
  }

  .icon-notification {
    background-color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;

    &:hover {
      cursor: pointer;
    }
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 1vw;
    color: #707070;
  }

  .count-notifications {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    background-color: red;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    top: -5px;
    right: -5px;
    color: #fff;
    font-size: 10px;
  }

  .profile-img {
    background-color: #fff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .profile-name {
    display: flex;
    gap: 10px;

    &:hover {
      cursor: pointer;
    }
  }
`;

export const Left = styled.div`
  background-color: var(--blue);
  width: 70px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 15px 10px;
`;

export const Top = styled.div`
  background-color: var(--blue);
  width: calc(100vw - 70px);
  height: 70px;
  position: fixed;
  top: 0;
  right: 0;
  padding: 10px 5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Body = styled.div`
  padding-top: 70px;
  padding-left: 70px;
`;

export const Input = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  width: 40%;
  background-color: #fff;
  border-radius: 40px;
  padding: 0 20px;

  input {
    margin-left: 10px;
    border: none;
    width: 100%;
  }
`;

export const ArrowContent = styled.div`
  ${({ open }) => css`
    position: relative;
    .arrow {
      transform: ${open ? "rotate(180deg)" : "rotate(0deg)"};
      transition: all 0.3s ease-in-out;
    }
  `}
`;

export const SelectOptions = styled.div`
  ${({ open }) => css`
    position: absolute;
    display: flex;
    padding: 5px 10px;
    font-size: 16px;
    gap: 10px;
    flex-direction: column;
    width: 200px;
    height: 150px;
    left: -180px;
    border: 1px solid black;
    border-radius: 8px;
    background-color: #fff;
    transition: all ease-in-out 0.3s;
    opacity: 1;
    top: 40px;

    option{
      :hover{
        background-color: var(--blue);
      }
    }
    ${!open &&
    css`
      opacity: 0;
      top: 20px;
    `}
  `}
`;
