import styled from "styled-components";

export const DepartamentItems = styled("div")`
  background-color: #f7f7f7;
  padding: 10px;
  width: 100%;

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
