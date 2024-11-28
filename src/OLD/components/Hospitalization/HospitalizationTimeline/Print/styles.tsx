import styled from "styled-components";

export const Container = styled.div`
  @media print {
    margin: 10px;
    p {
      margin: 2px !important;
    }

    @page {
      size: auto !important; /* auto is the initial value */

      /* this affects the margin in the printer settings */
      margin: 2.5cm 2.5cm 2.5cm 2.5cm;

      .print-footer {
        position: fixed;
        bottom: 0 !important;
      }
    }

    /* reference: https://stackoverflow.com/questions/1542320/margin-while-printing-html-page */
  }
`;
