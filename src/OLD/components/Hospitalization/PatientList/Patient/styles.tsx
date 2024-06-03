// @ts-nocheck
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;

  .patient-box {
    padding: 5px;
    cursor: pointer;
    justify-content: space-between;
  }

  .calendar-item {
    border: solid 0.5px var(--blue);
    background-color: #ffffff;
    text-align: left;

    section {
      display: flex;
      flex-direction: column;
    }

    .occurrence-icon,
    .prescription-icon {
      cursor: pointer;
    }

    .plus-icon {
      margin-left: 2px;
      :hover {
        color: var(--blue);
        cursor: pointer;
      }
    }
  }

  .hour-item {
    width: 0%;
    .triangle-icon {
      cursor: pointer;
    }
  }
`;

export const PatientBox = styled.div`
  .patient-oc {
    cursor: pointer;
    background-color: ${(props) => props.backgroundNameColor || "var(--blue)"};
    color: ${(props) => props.textColor || "black"};
    border-radius: 3px;
    padding-left: 5px;
    :hover {
      background-color: var(--darkBlue);
    }
  }

  padding: 5px;
  border: solid 0.5px var(--blue);
  border-radius: 5px;
  background-color: #ffffff;

  .triangle-icon {
    cursor: pointer;
  }
`;
