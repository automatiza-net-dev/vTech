// @ts-nocheck
import {
  Form,
  Modal,
  notification,
  Select,
  Checkbox,
  DatePicker,
  Space,
} from "antd";
import { Button } from "@/OLD/components/mini-components";
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
  const [frequency, setFrequency] = useState([]);
  const [allChecked, setAllChecked] = useState(false);

  const schema = yup
    .object({
      startHour: yup.string().required("Compo obrigatório!"),
      endHour: yup.string().required("Compo obrigatório!"),
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

  const Input = memo(({ value, type, format }) => {
    return (
      <div style={{ width: "100%" }}>
        <input
          onChangeCapture={(e) => {
            setPayload({
              ...payload,
              [`${value}`]: format
                ? moment(e.target.value).format(format)
                : e.target.value,
            });
          }}
          className={`uk-input ${
            errors?.[value]?.message ? "uk-form-danger" : ""
          }`}
          type={type ? type : ""}
          {...register(value, { required: true, maxLength: 20 })}
        />
      </div>
    );
  });

  const [isVisible, setIsVisible] = useState(false);
  const { Option } = Select;
  const [payload, setPayload] = useState({
    userId: useRouter().query.id,
  });
  const { mutate, loading } = useMutation(
    (data) => calendarService.createAbsence({ ...data, ...payload }),
    {
      onError: () => {
        notification.error({
          message: "Erro",
          description: "Erro ao cadastrar indisponibilidade",
        });
      },
      onSuccess: () => {
        notification.success({
          message: "Sucesso",
          description: "Sucesso ao cadastrar indisponibilidade",
        });
        setIsVisible(false);
        queryClient.invalidateQueries("getAbsences");
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
        notification.error({
          message: "Frequência",
          description: "Marque pelo menos um dia para",
        });
      } else {
        mutate({ ...payload, frequency });
      }
    },
    [payload, frequency]
  );

  return (
    <div>
      <button
        className="uk-button uk-button-danger uk-border-pill"
        onClick={() => setIsVisible(true)}
      >
        Adicionar bloqueio de agenda
      </button>
      <Modal
        visible={isVisible}
        title="Novo bloqueio de agenda"
        onCancel={() => setIsVisible(false)}
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
              <Input value="startHour" type="time" />
            </Form.Item>
            <Form.Item label="Hora de saída">
              <Input value="endHour" type="time" />
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
    </div>
  );
});
