import styled from "styled-components";

export const LastUpdates = styled("div")`
  display: flex;
  gap: 15px;

  .loading {
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .box-left {
    max-width: 350px;
    width: 100%;
  }

  .time_line_container {
    max-height: 500px;
    overflow: auto;
    padding-right: 5px;
  }

  .content_timeline {
    width: 100%;
    padding: 20px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.primaryColor};
  }
`;
