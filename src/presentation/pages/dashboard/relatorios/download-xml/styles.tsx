import styled from "styled-components";

export const DownloadXML = styled.div`
  form > div {
    display: flex;
    width: 100%;
    justify-content: space-between;

    > div {
      flex: 1;

      &:last-child {
        max-width: 180px;
        button {
          background: ${(props) => props.theme.primaryColor};
        }
      }
    }
  }

  .conntent_form_infinity_forge {
    display: flex;
    align-items: center;
    gap: 10px;

    > div {
      flex: 1;
      max-width: 500px;
      height: auto;
    }
  }

  .react-daterange-picker {
    width: 100%;
  }

  .react-daterange-picker__inputGroup {
    width: auto !important;
  }
`;
