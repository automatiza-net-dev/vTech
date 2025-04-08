import styled from "styled-components";

export const Departaments = styled("div")`
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;

  .list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .button-select-departament {
    width: 120px;
    border: none;
    background: none;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;
    border: 1px solid transparent;
    transition: 0.3s;
    transition: transform 0.2s;

    img {
      width: 100%;
      height: 80px;
      object-fit: contain;
    }

    &.active {
      border: 1px solid #5cc100;
    }

    &:hover {
      border: 1px solid #5cc100;
    }
  }

  @media only screen and (max-width: 1400px) {
    .button-select-departament {
      width: 100px;
    }
  }
`;
