import styled from "styled-components";

export const Profile = styled("div")`
  width: fit-content;
  display: flex;
  gap: 20px;
  max-width: 400px;
  width: 100%;

  .avatar {
    width: 155px;
    height: 155px;
    border-radius: 5px;
    overflow: hidden;
  }

  > div {
    width: calc(100% - 175px);
    
    span {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    h1 {
      color: ${(props) => props.theme.darkColor};
      font-size: 32px;
      font-weight: 700;
      text-transform: capitalize;
      text-align: left;

      &:hover {
        text-decoration: underline;
      }
    }

    .status {
      margin: 10px 0;
      font-size: 12px;

      > div {
        height: 22px;
        border-radius: 100rem;
      }
    }

    .infos {
      color: #828282;

      svg {
        width: 16.67px;
        height: auto;
        fill: currentColor;
      }

      > span + span {
        margin-top: 5px;
      }

      > span {
        color: #828282;
        font-size: 14px;
      }
    }
  }
`;
