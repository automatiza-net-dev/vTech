// @ts-nocheck
import styled from "styled-components";

export const Container = styled.div``;

export const InputBox = styled.div`
  align-items: center;
  background-color: #fff;
  border-radius: 40px;
  display: flex;
  height: 40px;
  padding: 0 20px;
  border: 0.5px solid #cacaca;

  input,
  .date-component,
  .select-component {
    border: none;
    width: 100%;
  }
`;

export const PatientBox = styled.div`
  width: 250px;

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
