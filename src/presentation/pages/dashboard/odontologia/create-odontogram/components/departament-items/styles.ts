import styled from "styled-components";

export const DepartamentItems = styled("div")`
  padding: 10px;
  width: 100%;

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

  .item-card {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    border: 1px solid #ccc;
    background-color: #fff;
    border-radius: 5px;
    margin: 5px 0;
    flex-direction: column;
    justify-content: space-between;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center center;
  }

  input {
    cursor: pointer;
    margin-top: 2px;
  }
`;
