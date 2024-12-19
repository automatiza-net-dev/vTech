import styled from "styled-components";

export const Container = styled.div`
  .ql-align-center {
    text-align: center;
  }
  .ql-align-right {
    text-align: right;
  }
  .ql-align-justify {
    text-align: justify;
    text-justify: inter-word;
  }
`;

export const PrintScreen = styled.div`
  word-wrap: break-word;
  width: 100%;
  font-size: 1.5em;

  @media print {
    p {
      margin: 2px !important;
    }

    @page {
      size: auto !important; /* auto is the initial value */
      /* this affects the margin in the printer settings */

      .print-footer {
        position: fixed;
        bottom: 0 !important;
      }
    }

    /* reference: https://stackoverflow.com/questions/1542320/margin-while-printing-html-page */
  }
`;
