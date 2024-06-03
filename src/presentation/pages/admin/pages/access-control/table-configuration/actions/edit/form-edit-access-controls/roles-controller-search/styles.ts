import styled from "styled-components";

export const RolesControllerSearch = styled("div")`
  min-width: 280px;

  input[type="text"] {
    height: 40px;
  }

  .switchs {
    display: flex;
    align-items: center;
    gap: 5px;
    justify-content: flex-start;

    .input_control {
      display: flex;
      width: auto;
      gap: 0;

      label {
        font-size: 13px !important;
      }

      .input-content {
        transform: scale(0.7);
      }
    }

    .second {
      label {
        min-width: 90px;
      }
    }
  }
`;
