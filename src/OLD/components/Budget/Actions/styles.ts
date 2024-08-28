import styled from "styled-components";

export const Status = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  gap: 10px;
  align-items: center;

  .ball {
    width: 20px;
    height: 20px;
    border-radius: 100rem;
  }
`;

export const TotalBox = styled.div`
  background: #f5f5f5;
  border-radius: 5px;
  padding: 1.6rem;
  display: flex;
  align-items: center;

  > div:first-child {
    max-width: 24%;
  }

  > div {
    flex: 1;
    max-width: 14%;
  }
`;
