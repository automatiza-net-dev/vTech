import styled from "styled-components";

export const Departaments = styled("div")`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;

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

    &:hover {
      border: 1px solid ${(props) => props.theme.primaryColor};
    }
  }
`;
