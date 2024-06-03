import styled from "styled-components";

export const AddTutor = styled.button`
  width: 20px;
  padding: 0;
  border: 0;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;

  svg {
    height: auto;
    width: 100%;
    fill: ${(props) => props.theme.green};
  }
`;

export const ModalContent = styled.div`
  min-height: fit-content;

  .box-white {
    overflow-y: unset !important;
    overflow-x: unset !important;
  }

  > div {
    height: inherit;
  }

  .select-box {
    .menu {
      width: 100%;
      overflow-y: auto;
      max-height: 33vh;
    }
  }

  .form-button {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    margin: 15px 0 0 auto;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding-top: 15px;
    justify-content: flex-end;

    a,
    button {
      height: 40px !important;
      background-color: #fa972b !important;
      padding: 0 15px;
      font-weight: 700;
      color: #fff;
      width: 100%;
      border-radius: 5px;
      border: 1px solid #fa972b !important;
      text-decoration: unset !important;

      &:hover {
        opacity: 0.9;
        color: #fff !important;
      }
    }
  }
`;
