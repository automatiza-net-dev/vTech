// @ts-nocheck
// Core
import React, { memo, useEffect } from "react";

// Icons
import { Calendar } from "@styled-icons/bootstrap/Calendar";
import { CheckCircle } from "@styled-icons/bootstrap/CheckCircle";
import { Cancel } from "@styled-icons/material-outlined/Cancel";
import { TbVaccine } from "react-icons/tb";

// Components
import { Input, DatePicker, Button, notification } from "antd";

const FormChild = memo(function FormChild({
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
  setActiveTab
}) {
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
                      schedulingDate: e
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
                      applicationDate: e
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
                      laboratory: e.target.value
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
                      batch: e.target.value
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
                    <Calendar
                      size={15}
                      className={
                        !item?.applicationDate
                          ? !actionState
                            ? "schedule-active"
                            : "icon-inative"
                          : "icon-inative"
                      }
                      onClick={() => {
                        if (!item?.applicationDate) {
                          setSelectedIndex(i);
                          setActualData({ ...item });
                          setActionState("schedule");
                        }
                      }}
                    />
                  </span>
                  <span>
                    <CheckCircle
                      size={20}
                      className={
                        actionState && selectedIndex === i
                          ? "confirm-icon-active"
                          : "icon-inative"
                      }
                      onClick={() => {
                        const obj = [...calendars];
                        obj.splice(i, 1, {
                          ...item,
                          ...actualData
                        });
                        if (
                          !actualData?.batch ||
                          !actualData?.applicationDate ||
                          !actualData?.laboratory
                        ) {
                          return notification.error({
                            message:
                              "verifique se os campos estão preenchidos corretamente"
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
                    />
                  </span>
                  <span>
                    <Cancel
                      size={23}
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
                    />
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
      {!modal && (
        <div className="uk-margin-top uk-flex uk-flex-right">
          <Button
            type="primary"
            htmlType="button"
            onClick={() => setActiveTab("11")}
          >
            Ir para vacinas
          </Button>
        </div>
      )}
    </form>
  );
});

export default FormChild;
