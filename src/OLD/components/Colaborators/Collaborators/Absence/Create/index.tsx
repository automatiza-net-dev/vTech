// @ts-nocheck
import { Form, Modal, Select, Checkbox, DatePicker, Space } from "antd";
import { useToast, Button } from "infinity-forge";
import { useRouter } from "next/router";
import { memo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { calendarService } from "@/OLD/services/calendar.service";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { days } from "./weekdays";
import moment from "moment";
import "moment/locale/pt-br";

export const Create = memo(() => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [frequency, setFrequency] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const schema = yup
    .object({
      // startHour: yup.string().required("Compo obrigatório!"),
      // endHour: yup.string().required("Compo obrigatório!"),
      // startDate: yup.string().required("Compo obrigatório!"),
      // endDate: yup.string().required("Compo obrigatório!"),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [isVisible, setIsVisible] = useState(false);
  const { Option } = Select;
  const { createToast } = useToast();
  const [payload, setPayload] = useState({
    userId: router.query.id,
  });
  const { mutate, loading } = useMutation(
    (data) => calendarService.createAbsence({ ...data, ...payload }),
    {
      onError: (error) => {
        error?.response?.data?.errors?.forEach((err) =>
          createToast({ message: err?.message, status: "error" })
        );
      },
      onSuccess: () => {
        createToast({
          message: "Sucesso ao cadastrar indisponibilidade",
          status: "success",
        });
        setIsVisible(false);
        queryClient.invalidateQueries("getAbsences");
        setPayload({
          userId: router.query.id,
        });
      },
    }
  );

  const onSubmit = useCallback(
    (data) => {
      if (frequency.includes("terça")) {
        const index = frequency.indexOf("terça");
        frequency[index] = "terca";
      }

      if (frequency.length === 0) {
        createToast({ message: "Marque pelo menos um dia", status: "error" });
      } else {
        mutate({ ...payload, frequency });
      }
    },
    [payload, frequency]
  );

  return (
    <div>
      <Button
        text="Adicionar bloqueio de agenda"
        onClick={() => setIsVisible(true)}
      />
      {isVisible && (
        <Modal
          visible={isVisible}
          title="Novo bloqueio de agenda"
          onCancel={() => {
            setIsVisible(false);
            setPayload({
              userId: router.query.id,
              endHour: null,
              startHour: null,
            });
          }}
          onOk={() => document.getElementById("create").click()}
          width={"50%"}
          loading={loading}
        >
          <Form layout="vertical" onSubmitCapture={handleSubmit(onSubmit)}>
            <Form.Item label="Título">
              <input
                className="uk-input"
                onChange={(e) =>
                  setPayload({ ...payload, title: e.target.value })
                }
              />
            </Form.Item>
            <div className="uk-flex uk-flex-between" style={{ gap: "10px" }}>
              <Form.Item label="Data de inicio" className="uk-width-1-4">
                <Space>
                  <DatePicker
                    placeholder="dd/mm/aaaa"
                    className=""
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        startDate: moment(e).format("YYYY-MM-DD"),
                      })
                    }
                    format="DD/MM/YYYY"
                  />
                </Space>
              </Form.Item>
              <Form.Item label="Data de saida" className="uk-width-1-4">
                <Space>
                  <DatePicker
                    placeholder="dd/mm/aaaa"
                    className=""
                    onChange={(e) =>
                      setPayload({
                        ...payload,
                        endDate: moment(e).format("YYYY-MM-DD"),
                      })
                    }
                    format="DD/MM/YYYY"
                  />
                </Space>
              </Form.Item>
              <Form.Item label="Hora de inicio">
                <input
                  onChange={(e) => {
                    setPayload({
                      ...payload,
                      startHour: e.target.value,
                    });
                  }}
                  className={`uk-input ${
                    errors?.startHour?.message ? "uk-form-danger" : ""
                  }`}
                  type={"time"}
                />
              </Form.Item>
              <Form.Item label="Hora de saída">
                <input
                  onChange={(e) => {
                    setPayload({
                      ...payload,
                      endHour: e.target.value,
                    });
                  }}
                  className={`uk-input ${
                    errors?.endHour?.message ? "uk-form-danger" : ""
                  }`}
                  type={"time"}
                />
              </Form.Item>
            </div>
            <Form.Item label="Dias da semana">
              {days.map((day, key) => {
                return (
                  <Checkbox
                    value={day.label}
                    key={key}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAllChecked(false);
                        setFrequency([...frequency, e.target.value]);
                      } else {
                        setAllChecked(false);
                        const newArr = [...frequency];
                        newArr.splice(frequency.indexOf(e.target.value), 1);
                        setFrequency(newArr);
                      }
                    }}
                    checked={frequency.includes(day.label)}
                  >
                    {day.label}
                  </Checkbox>
                );
              })}
              <Checkbox
                checked={allChecked}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAllChecked(true);
                    let newArr = [];
                    days.map((item) => {
                      newArr.push(item.label);
                    });
                    setFrequency(newArr);
                  } else {
                    setAllChecked(false);
                    setFrequency([]);
                  }
                }}
              >
                Todos os dias
              </Checkbox>
            </Form.Item>
            <input type="submit" id="create" style={{ display: "none" }} />
          </Form>
        </Modal>
      )}
    </div>
  );
});
