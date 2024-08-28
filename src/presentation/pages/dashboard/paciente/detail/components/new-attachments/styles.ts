import styled from "styled-components";

export const NewAttachments = styled("section")`
  input[type="file"] {
    display: none;
  }

  .custom-file-upload {
    background-color: ${(props) => props.theme.primaryColor};
    border-radius: 5px;
    border: none;
    color: #fff;
    height: 45px;
    padding: 0 15px !important;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;
