import styled from "styled-components";

export const Prescription = styled("div")`
  span, strong {
    font-size: 14px;
  }

  .header_accordion {
    padding: 12px 16px;
    color: rgba(0, 0, 0, 0.85);
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #d9d9d9;
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .top {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }
  }

  .content {
    height: 0;
    opacity: 0;
    padding: 10px; 
    overflow: hidden;
    transition: 0.2s;

    > button {
        margin-bottom: 10px;
        margin-left: auto;
        display: flex;
    }

    .scheduling {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px; 
        margin-bottom: 10px;

        > div {
            display: flex;
            gap: 10px;
            flex-direction: column;
        }
    }
  }

  .content.open {
    height: 100%;
    opacity: 1;
  }
`;
