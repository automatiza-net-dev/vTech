import React, { memo, useEffect } from "react";

import { TbVaccine } from "react-icons/tb";

import { Icon } from "infinity-forge";

import { Input, DatePicker, Button, notification } from "antd";

export default function FormChild({
  changeTab,
  vaccineData,
  calendars,
  actionState,
  selectedIndex,
  setSelectedIndex,
  actualData,
  setActualData,
  setActionState,
  submitUpdate,
  setCalendars,
  modal,
}: any) {
  useEffect(() => {
    calendars.sort((a, b) => a.dose - b.dose);
  }, [calendars]);

  return (
    <form>
      <div>
        <label>Vacina</label>
        <p>{`${vaccineData?.vaccine} - ${vaccineData?.protocolLabel}`}</p>
      </div>
      <div className="uk-margin-top uk-flex">
        <div className="uk-width-1-6">
          <label> Dose </label>
          {calendars.length > 0 &&
            calendars.map((item) => (
              <div>
                <Input disabled={true} value={item?.dose} />
              </div>
            ))}
        </div>
        <div className="uk-width-1-3">
          <label> Data prevista </label>
          {calendars.length > 0 &&
            calendars.map((item, i) => (
              <div>
                <DatePicker
                  className="uk-width-1-1"
                  format={"DD/MM/YYYY"}
                  disabled={
                    !(actionState === "schedule" && selectedIndex === i)
                  }
                  value={
                    actionState === "schedule" && selectedIndex === i
                      ? actualData?.schedulingDate
                      : item?.schedulingDate
                  }
                  onChange={(e) => {
                    setActualData({
                      ...actualData,
                      schedulingDate: e,
                    });
                  }}
                />
              </div>
            ))}
        </div>
        <div className="uk-width-1-2">
          <label> Data de aplicação </label>
          {calendars.length > 0 &&
            calendars.map((item, i) => (
              <div>
                <DatePicker
                  className="uk-width-1-1"
                  format={"DD/MM/YYYY"}
                  disabled={!(actionState === "vaccine" && selectedIndex === i)}
                  value={
                    actionState === "vaccine" && selectedIndex === i
                      ? actualData?.applicationDate
                      : item?.applicationDate
                  }
                  onChange={(e) => {
                    setActualData({
                      ...actualData,
                      applicationDate: e,
                    });
                  }}
                />
              </div>
            ))}
        </div>
        <div className="uk-width-1-4">
          <label> Laboratório </label>
          {calendars.length > 0 &&
            calendars.map((item, i) => (
              <div>
                <Input
                  disabled={!(actionState === "vaccine" && selectedIndex === i)}
                  value={
                    actionState === "vaccine" && selectedIndex === i
                      ? actualData?.laboratory
                      : item?.laboratory
                  }
                  onChange={(e) => {
                    setActualData({
                      ...actualData,
                      laboratory: e.target.value,
                    });
                  }}
                />
              </div>
            ))}
        </div>
        <div className="uk-width-1-4">
          <label> Lote </label>
          {calendars.length > 0 &&
            calendars.map((item, i) => (
              <div>
                <Input
                  disabled={!(actionState === "vaccine" && selectedIndex === i)}
                  value={
                    actionState === "vaccine" && selectedIndex === i
                      ? actualData?.batch
                      : item?.batch
                  }
                  onChange={(e) =>
                    setActualData({
                      ...actualData,
                      batch: e.target.value,
                    })
                  }
                />
              </div>
            ))}
        </div>

        {modal && (
          <div className="uk-width-1-4">
            <label> Ações </label>
            {calendars.length > 0 &&
              calendars.map((item, i) => (
                <div
                  className={`uk-flex uk-flex-around uk-width-1-1 ${
                    i > 0 ? "uk-margin-small-top" : ""
                  }`}
                >
                  <span>
                    <TbVaccine
                      size={20}
                      className={
                        !item?.applicationDate
                          ? !actionState
                            ? "vaccine-icon"
                            : "icon-inative"
                          : "icon-inative"
                      }
                      onClick={() => {
                        if (!item?.applicationDate) {
                          setSelectedIndex(i);
                          setActualData({ ...item });
                          setActionState("vaccine");
                        }
                      }}
                    />
                  </span>
                  <span>
                    <svg
                      onClick={() => {
                        if (!item?.applicationDate) {
                          setSelectedIndex(i);
                          setActualData({ ...item });
                          setActionState("schedule");
                        }
                      }}
                      viewBox="0 0 16 16"
                      height="15"
                      width="15"
                      focusable="false"
                      role="img"
                      fill="#000"
                      xmlns="http://www.w3.org/2000/svg"
                      className={
                        !item?.applicationDate
                          ? !actionState
                            ? "schedule-active"
                            : "icon-inative"
                          : "icon-inative"
                      }
                    >
                      <title>Calendar icon</title>
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"></path>
                    </svg>
                  </span>
                  <span>
                    <svg
                      onClick={() => {
                        const obj = [...calendars];
                        obj.splice(i, 1, {
                          ...item,
                          ...actualData,
                        });
                        if (
                          !actualData?.batch ||
                          !actualData?.applicationDate ||
                          !actualData?.laboratory
                        ) {
                          return notification.error({
                            message:
                              "verifique se os campos estão preenchidos corretamente",
                          });
                        }

                        if (actionState) {
                          submitUpdate(actualData);
                          setCalendars(obj);
                          setSelectedIndex(false);
                          setActionState(false);
                          setActualData({});
                        }
                      }}
                      viewBox="0 0 16 16"
                      height="20"
                      width="20"
                      focusable="false"
                      role="img"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className={
                        actionState && selectedIndex === i
                          ? "confirm-icon-active"
                          : "icon-inative"
                      }
                    >
                      <title>CheckCircle icon</title>
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"></path>
                    </svg>
                  </span>
                  <span>
                    <button
                      type="button"
                      className={
                        actionState && selectedIndex === i
                          ? "cancel-icon-active"
                          : "icon-inative"
                      }
                      onClick={() => {
                        setSelectedIndex(false);
                        setActionState(false);
                        setActualData({});
                      }}
                      style={{
                        background: "transparent",
                        border: 0,
                        padding: 0,
                      }}
                    >
                      <Icon name="IconBlock" fill="#f10" />
                    </button>
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
      {!modal && changeTab && (
        <div className="uk-margin-top uk-flex uk-flex-right">
          <Button
            type="primary"
            htmlType="button"
            onClick={() => changeTab("vaccines")}
          >
            Ir para vacinas
          </Button>
        </div>
      )}
    </form>
  );
}
