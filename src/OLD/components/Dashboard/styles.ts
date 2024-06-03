import styled, { css } from "styled-components";

export const Container = styled.div`
  padding: 40px;

  .header {
  }

  .subinfos {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    h6 {
      margin: 0;
    }
  }

  .consults-day {
    display: flex;
    flex-direction: column;
    padding: 25px 30px;
    border: 2px solid #ebebeb;
    border-radius: 20px;
    background-color: #fff;
  }

  .header-consults {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    h3 {
      margin: 0;
    }
  }

  .schedule-button {
    border: 2px solid #ebebeb;
    padding: 4px 10px;
    border-radius: 8px;
    transition: all ease-in-out 0.3s;
    :hover {
      cursor: pointer;
      border-color: #ccc;
    }
  }

  .patient-cards {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }

  .footer-consults {
    display: flex;
    justify-content: space-around;
    gap: 10px;
  }

  .tag-caption {
    display: flex;
    gap: 3px;
    align-items: center;
  }
`;

export const TagCaption = styled.div`
  ${({ color }) => css`
    width: 35px;
    height: 15px;
    border-radius: 15px;
    background-color: ${color};
  `}
`;
