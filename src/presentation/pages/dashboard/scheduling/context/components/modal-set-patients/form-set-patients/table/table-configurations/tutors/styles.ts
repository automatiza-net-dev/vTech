import styled from "styled-components";

export const Tutors = styled.div`
  padding: 5px 0;

  .actions {
    display: flex;
    gap: 4px;
  }

  .tutors-list {
    text-align: left !important;
    display: flex;
    align-items: center;
    gap: 10px;

    > .list {
      width: calc(100% - 25px);
    }
  }
`;
