import styled from "styled-components";

export const ItemCard = styled.div<any>`
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) => (props.selected ? "#e0f7fa" : "#fff")};
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
`;

export const Checkbox = styled.input`
  margin-left: 10px;
  cursor: pointer;
`;

