import styled from "styled-components";

export const Container = styled.div`
  overflow-y: auto;

  .img-box {
    width: 150px;
    height: 150px;
    border: 2px dashed #ccc;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .add-image {
      :hover {
        color: var(--blue);
        cursor: pointer;
      }
    }
  }

  .ant-tooltip-inner {
    display: none;
  }

  .ant-upload-list-item-error {
    border-color: transparent !important;
  }
`;
