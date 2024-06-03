// @ts-nocheck
import styled from "styled-components";

export const Container = styled.section`
  .general-box {
    border-radius: 5px;
    margin-top: 5%;
    background-color: #191970;
    color: white !important;
    h4,
    h2 {
      color: white !important;
    }
    padding: 5px;
  }

  .custom-margin-left {
    margin-left: 2%;
  }

  .custom-width {
    width: 98%;
  }

  .ant-table-cell {
    padding: 5px !important;
    font-size: 0.7em;
  }

  .custom-bordered {
    padding: 2px;
    border: ${({ host }) => {
      if (host === "Vetech") {
        return "2px inset var(--blue)";
      }

      if (host === "Sanclá") {
        return "2px inset var(--orange-light-1)";
      }

      if (host === "LiftOne") {
        return "2px inset var(--lo-blue)";
      }

      return "red";
    }} !important;
    border-radius: 5px;
  }

  .table-container {
    max-height: 150px;
    overflow-y: scroll;
  }

  .swiper {
    width: 100%;
  }
`;
