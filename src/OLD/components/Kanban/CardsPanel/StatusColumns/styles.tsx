import styled from "styled-components";

export const Container = styled.div`
  .side-bar-section {
    z-index: 21;
  }

  .title-header {
    align-items: center;
    background-color: #ffffff;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    margin: 2px;
    height: 25px;
  }

  .cards-container {
    background-color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    margin: 2px;
    margin-top: 7px;
    padding: 5px;
  }

  .custom-icon {
    cursor: pointer;
    :hover {
      color: blue;
      transform: rotate(180deg);
      transition-duration: 0.3s;
    }
  }
`;
