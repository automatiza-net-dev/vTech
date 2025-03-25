import styled from "styled-components";

export const Departaments = styled("div")`
  display: flex;
  gap: 15px;

  button {
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;
    border: 1px solid transparent;
    transition: 0.3s;
    height: 80px;
    background-color: #ccc;

    img {
      width: 100%;
    }

    &:hover {
      border: 1px solid ${(props) => props.theme.primaryColor};
    }
  }

  .button-select-departament {
    width: 120px;
    border: none;
    background: none;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .button-select-departament img {
    width: 100%;
    height: 80px;
    object-fit: contain;
  }
`;
