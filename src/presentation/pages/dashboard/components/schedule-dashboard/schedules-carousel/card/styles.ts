import styled from "styled-components";

export const ScheduleCard = styled("button")`
  width: 100%;
  border-radius: 5px;
  border: 1px solid var(--cinza-200, #e1e1e1);
  background-color: #fff;
  padding: 20px 15px;
  text-align: start;
  transition: 0.1s transform, box-shadow;
  position: relative;
  z-index: 21;
  align-self: stretch;
  min-height: 380px;

  &:hover {
    transform: scale(1.01);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
  }

  span {
    display: block;
  }

  span + span {
    margin-top: 2px;
    color: #2b2b2b !important;
  }

  .top {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;

    > div {
      > h4 {
        color: #2b2b2b;
        font-size: 16px;
        font-weight: 700;
        text-align: start;
        line-height: 1;
      }

      > span {
        color: #828282;
        line-height: 1;
        font-size: 12px;
        font-weight: 400;
      }
    }

    .avatar {
      width: 50px;
      height: 50px;
      overflow: hidden;
      border-radius: 100%;
      background-color: #444;
    }
  }

  .bottom {
    > h5 {
      color: #828282;
      font-size: 16px;
      font-weight: 700;
      line-height: 1;
      height: 18px;
    }

    .service_type {
      display: block;
      margin: 5px 0;
      color: #2b2b2b;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
    }

    .description {
      color: #828282;
      font-size: 14px;
      height: 5.47vw;
      min-height: 85px;
      max-height: 105px;
      font-weight: 400;
      line-height: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      line-clamp: 5;
      -webkit-box-orient: vertical;
      transition: all 0.2s;
    }
  }

  .status-bar {
    margin: 20px 0;
    border-radius: 5px;
    background: #c9c9c9;
    width: 100%;
    height: 31px;
    text-align: center;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--branco, #fff);
    font-size: 16px;
    font-weight: 400;
  }

  .date {
    max-width: fit-content;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #2b2b2b;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;

    svg {
      width: 20px;
      height: auto;
    }
  }

  .time_box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;

    #highlight-text {
      border-radius: 100rem !important;
      height: 25px !important;
      text-align: center;
    }
  }
`;
