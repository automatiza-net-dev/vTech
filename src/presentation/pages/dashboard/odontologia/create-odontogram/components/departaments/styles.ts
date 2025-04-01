import styled from "styled-components";

export const Departaments = styled("div")`
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
  align-items: flex-end;

  .list {
    display: flex;
    gap: 15px;
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

    &:hover {
      border: 1px solid ${(props) => props.theme.primaryColor};
    }
  }

  .action {
    display: flex; 
    align-items: flex-end;
    justify-content: center;
    width: 44px;
    height: 44px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 10px 0px;
    border: 1px solid transparent;
    border-radius: 4px; 
    background-color: white; 
    cursor: pointer; 
    transition: all 0.3s ease-in-out; 
  }

  .action:hover {
    background-color: #f0f0f0; 
  }

  .action svg {
    width: 35px; 
    height: 35px;
  }
`;
