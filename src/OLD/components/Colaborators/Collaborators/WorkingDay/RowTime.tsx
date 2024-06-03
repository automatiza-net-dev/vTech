// @ts-nocheck
import { Button, Col, Input, notification, Row, Select } from "antd";
import { LoadingSpin } from "@/OLD/components/mini-components";
import { useRouter } from "next/router";
import { userService } from "@/OLD/services/user.service";
import { convertTime } from "@/OLD/utils/convertDate";
import { Delete } from "./Delete";
import { useQueryClient } from "react-query";

import { TimePicker } from "@mui/x-date-pickers";

import { AiOutlineCheck } from "react-icons/ai";

import { memo, useState, useCallback, useEffect } from "react";

import moment from "moment";

export const RowTime = memo(
  ({ day, edit, reload, setReload, rowEditing = false }) => {
    const router = useRouter();
    const userId = router?.query?.innerpage;
    const [showSave, setShowSave] = useState(true);
    const [data, setData] = useState({
      userId,
      dayOfWeek: day?.week_day,
      startHour: moment(day?.start_hour, "HH:mm"),
      endHour: moment(day?.end_hour, "HH:mm"),
    });

    const [loading, setLoading] = useState();

    const queryClient = useQueryClient();

    const handleEdit = useCallback(() => {
      userService
        .editWorkingDay(day.id, {
          ...data,
          startHour: moment(data?.startHour).format("HH:mm"),
          endHour: moment(data?.endHour).format("HH:mm"),
        })
        .then((res) => {
          setShowSave(false);
        })
        .catch((err) => {
          notification.error({
            message: "Erro",
            description: "Erro ao editar jornada de trabalho",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }, [data, router]);

    return (
      <Row className="uk-margin-small-bottom">
        <Col span={5}>
          {rowEditing && showSave ? (
            <Select
              defaultValue={data?.dayOfWeek ? data?.dayOfWeek : data?.week_day}
              onChange={(e) => setData({ ...data, dayOfWeek: e })}
              className="uk-border-pill"
            >
              <option value="segunda">Segunda</option>
              <option value="terca">Terça</option>
              <option value="quarta">Quarta</option>
              <option value="quinta">Quinta</option>
              <option value="sexta">Sexta</option>
              <option value="sabado">Sabádo</option>
              <option value="domingo">Domingo</option>
            </Select>
          ) : (
            <h5
              className="uk-margin-remove"
              style={{ textTransform: "capitalize" }}
            >
              {data?.dayOfWeek ? data?.dayOfWeek : data?.week_day}
            </h5>
          )}
        </Col>
        <Col span={8}>
          <div style={{ paddingRight: "60px" }}>
            <TimePicker
              slotProps={{ textField: { variant: "standard" } }}
              className="uk-border-pill"
              disabled={!rowEditing && showSave}
              value={data?.startHour}
              onChange={(val) => {
                setShowSave(true);
                setData({ ...data, startHour: val });
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div style={{ paddingRight: "60px" }}>
            <TimePicker
              slotProps={{ textField: { variant: "standard" } }}
              disabled={!rowEditing && showSave}
              className="uk-border-pill"
              value={data?.endHour}
              onChange={(val) => {
                setShowSave(true);
                setData({ ...data, endHour: val });
              }}
            />
          </div>
        </Col>
        <Col span={2}>
          {rowEditing && (
            <>
              {showSave ? (
                <Button
                  className="uk-border-pill"
                  onClick={() => {
                    handleEdit();
                    setShowSave(false);
                  }}
                  disabled={loading}
                >
                  {loading ? <LoadingSpin /> : "Salvar"}
                </Button>
              ) : (
                <AiOutlineCheck size={25} />
              )}
            </>
          )}
          {edit && (
            <Delete
              id={day.id}
              onDelete={() => queryClient.invalidateQueries("workingDay")}
              reload={reload}
              setReload={setReload}
            />
          )}
        </Col>
      </Row>
    );
  }
);
