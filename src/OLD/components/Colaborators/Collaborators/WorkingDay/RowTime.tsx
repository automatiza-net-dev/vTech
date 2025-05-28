// @ts-nocheck
import { Button, Col, Input, Row, Select } from "antd";
import { LoadingSpin } from "@/OLD/components/mini-components";
import { useRouter } from "next/router";
import { userService } from "@/OLD/services/user.service";
import { convertTime } from "@/OLD/utils/convertDate";
import { Delete } from "./Delete";
import { useQueryClient } from "@/presentation/use-query";

import { TimePicker } from "@mui/x-date-pickers";

import { AiOutlineCheck } from "react-icons/ai";

import { memo, useState, useCallback, useEffect } from "react";

import moment from "moment";

export function RowTime({
  day,
  edit,
  reload,
  setReload,
  rowEditing = false,
  data,
  setData,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState();

  const queryClient = useQueryClient();

  return data?.map((item, index) => {
    return (
      <Row className="uk-margin-small-bottom">
        <Col span={5}>
          {rowEditing ? (
            <Select
              defaultValue={item?.dayOfWeek ? item?.dayOfWeek : item?.week_day}
              onChange={(e) => {
                const obj = [...data];
                obj.splice(index, 1, {
                  ...item,
                  dayOfWeek: e,
                });

                setData(obj);
              }}
              className="uk-border-pill"
            >
              <option value="segunda">Segunda</option>
              <option value="terca">Terça</option>
              <option value="quarta">Quarta</option>
              <option value="quinta">Quinta</option>
              <option value="sexta">Sexta</option>
              <option value="sabado">Sábado</option>
              <option value="domingo">Domingo</option>
            </Select>
          ) : (
            <h5
              className="uk-margin-remove"
              style={{ textTransform: "capitalize" }}
            >
              {item?.dayOfWeek ? item?.dayOfWeek : item?.week_day}
            </h5>
          )}
        </Col>
        <Col span={8}>
          <div style={{ paddingRight: "60px" }}>
            <TimePicker
              slotProps={{ textField: { variant: "standard" } }}
              className="uk-border-pill"
              disabled={!rowEditing}
              value={item.startHour}
              onChange={(e) => {
                const obj = [...data];
                obj.splice(index, 1, {
                  ...item,
                  startHour: e,
                });

                setData(obj);
              }}
            />
          </div>
        </Col>
        <Col span={8}>
          <div style={{ paddingRight: "60px" }}>
            <TimePicker
              slotProps={{ textField: { variant: "standard" } }}
              disabled={!rowEditing}
              className="uk-border-pill"
              value={item.endHour}
              onChange={(e) => {
                const obj = [...data];
                obj.splice(index, 1, {
                  ...item,
                  endHour: e,
                });

                setData(obj);
              }}
            />
          </div>
        </Col>
        <Col span={2}>
          <Delete
            id={item.id}
            onDelete={() => queryClient.invalidateQueries(["workingDay"])}
            reload={reload}
            setReload={setReload}
          />
        </Col>
      </Row>
    );
  });
}
