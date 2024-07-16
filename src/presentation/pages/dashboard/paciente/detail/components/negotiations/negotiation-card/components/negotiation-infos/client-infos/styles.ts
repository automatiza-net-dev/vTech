import styled from "styled-components";

export const ClientInfos = styled.div`
  border: 1px solid;
  border-right-color: rgba(0, 0, 0, 0.2);
  border-left-color: rgba(0, 0, 0, 0.2);
  border-top-color: rgba(0, 0, 0, 0.2);
  border-bottom-color: rgba(0, 0, 0, 1);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 10px;

  .top_infos {
    display: flex;
    gap: 30px;
    width: 100%;
  }

  p {
    gap: 5px;
    font-size: 13px;
    color: #000;
    margin-bottom: 2px;

    strong {
      text-transform: uppercase;
      margin-right: 8px;
    }
  }

  p:last-child {
    flex-direction: column;
    gap: 0;
  }
`;
