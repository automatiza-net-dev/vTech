import styled from "styled-components";

export const Scheduling = styled("div")`
  padding: 20px 10px;
  background-color: #f9f9f9;
  min-height: 1000px;
  width: 100%;

  .day-title {
    color: #6e6e6e;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 0;
    margin-left: 48px;
    margin-bottom: -10px;

    &::first-letter {
      text-transform: capitalize;
    }
  }

  .schedule_avulse {
    .schedule_content {
      padding: 10px;
      background-color: #fff;
    }
  }

  .top-name {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #6e6e6e;
    border-radius: 5px 5px 0px 0px;
    overflow: hidden;
    padding: 10px 20px;

    h3 {
      text-align: center;
      color: #fff;
    }
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 20px;

    .actions {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .options {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 30px;
      width: 520px;

      button {
        box-shadow: none;
        padding-top: 10px;
      }
    }
  }

  .schedule_users {
    gap: 20px;
    overflow-x: auto;
    transform: rotate(180deg);
    direction: rtl;

    > div {
      transform: rotate(180deg);
      width: 300px;
      min-width: 300px;
      padding-top: 10px;
    }
  }

  .fc-header-toolbar {
    background-color: ${(props) => props.theme.primaryColor};
    color: #fff;
  }
  .fc .fc-toolbar.fc-header-toolbar {
    padding-top: 10px;
    margin-bottom: 0;
  }

  .fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
    opacity: 0.9;
  }

  .fc-header-toolbar button {
    background-color: transparent;
    border: none;
    color: #fff;
    font-weight: bold;
    margin: 0 5px;
  }

  .fc-header-toolbar button:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: #fff;
  }

  .fc-header-toolbar .fc-toolbar-title {
    font-size: 0.9em;
    padding-bottom: 6px;
  }

  .fc-daygrid-day {
    border: 1px solid #ddd;
  }

  .fc-event {
    background-color: transparent;
    color: #000;
    border: none;

    * {
      color: #000;
    }
  }

  .fc .fc-popover {
    background-color: #fff;
    color: #333;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .fc .fc-popover .fc-header .fc-close {
    color: #666;
  }

  .fc .fc-event-title {
    font-weight: bold;
  }

  .fc-event-main {
    padding: 0;
  }
`;
