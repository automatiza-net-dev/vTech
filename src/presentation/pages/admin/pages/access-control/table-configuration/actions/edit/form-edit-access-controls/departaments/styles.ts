import styled from "styled-components";

export const Departaments = styled("div")`
  max-width: 100%;
  width: 100%;

  h4 {
    margin-bottom: 13px;
    color: #666;
    font-size: 14px;
    font-weight: 400;
  }

  .departament_id {
    display: none;
  }

  .list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 30px;
    row-gap: 5px;
  }
`;
