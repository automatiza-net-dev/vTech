import styled from "styled-components";

export const PdfPatientAttendance = styled("div")`
  margin-top: 20px !important;

  .row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 10px;

    svg {
      width: auto;
      height: 20px;
      fill: ${(props) => props.theme.primaryColor};
      margin-right: 5px;
    }

    strong {
      margin-right: 5px;
    }

    span:last-child {
      width: 290px;
    }
  }

  .attendance {
    h3 {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 5px;
    }

    > div {
      padding: 10px;
    }
  }

  footer {
    margin-top: 25px;
  }
`;
