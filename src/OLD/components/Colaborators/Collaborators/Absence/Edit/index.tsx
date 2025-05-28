// @ts-nocheck
import {
  Form,
  Modal,
  Select,
  Checkbox,
  DatePicker,
  Space,
  TimePicker,
} from "antd";
import { useRouter } from "next/router";
import { memo, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@/presentation/use-query";
import { useQueryClient } from "@/presentation/use-query";
import { calendarService } from "@/OLD/services/calendar.service";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { days } from "../Create/weekdays";
import { FiEdit2 } from "react-icons/fi";
import moment from "moment";
import { useToast } from "infinity-forge";

export const Edit = ({ item }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const id = router.query.innerpage;

  const [isVisible, setIsVisible] = useState(false);
  const [frequency, setFrequency] = useState(item?.frequency);
  const [allChecked, setAllChecked] = useState(false);
  const { Option } = Select;
  const [payload, setPayload] = useState({});

  const { createToast } = useToast();

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

  const Input = memo(({ value, type, preValue }) => {
    return (
      <div style={{ width: "100%" }}>
        <input
          value={preValue}
          className={`uk-input ${
            errors?.[value]?.message ? "uk-form-danger" : ""
          }`}
          type={type ? type : ""}
          {...register(value, { required: true, maxLength: 20 })}
        />
      </div>
    );
  });

  const { mutate, loading } = useMutation({
    queryKey: ["EditRandoma"],
    queryFn: (data) => {
      let newObj = {
        ...data,
        ...payload,
        startHour: moment(payload.startHour).format("HH:mm:ss"),
        endHour: moment(payload.endHour).format("HH:mm:ss"),
        frequency,
      };

      if (
        !moment(newObj.startDate).isValid() ||
        !moment(newObj.endDate).isValid()
      ) {
        delete newObj.startDate;
        delete newObj.endDate;
      } else {
        newObj = {
          ...data,
          ...payload,
          startHour: moment(payload.startHour).format("HH:mm:ss"),
          endHour: moment(payload.endHour).format("HH:mm:ss"),
          startDate: moment(payload.startDate).toISOString(),
          endDate: moment(payload.endDate).toISOString(),
        };
      }
      calendarService.editAbsence(item.id, newObj);
    },
    onError: () => {
      createToast({
        status: "error",
        message: "Erro ao editar indisponibilidade",
      });
    },
    onSuccess: () => {
      createToast({
        status: "success",
        message: "Sucesso ao editar indisponibilidade",
      });

      setIsVisible(false);
      queryClient.invalidateQueries(["getAbsences"]);
    },
  });

  const onSubmit = useCallback(
    (data) => {
      if (frequency.includes("terça")) {
        const index = frequency.indexOf("terça");
        frequency[index] = "terca";
      }
      mutate(data);
    },
    [payload, frequency]
  );

  useEffect(() => {
    setPayload({
      userId: id,
      active: item.active,
      frequency: item.frequency,
      startHour: moment(item.start_hour, "HH:mm"),
      endHour: moment(item.end_hour, "HH:mm"),
      startDate:
        item.start_date !== "---" ? moment(item.start_date, "DD-MM-YYYY") : "",
      endDate:
        item.end_date !== "---" ? moment(item.end_date, "DD-MM-YYYY") : "",
      title: item.title,
    });
  }, [item]);

  return (
    <div>
      <FiEdit2 
        style={{ cursor: 'pointer', fontSize: '1.2rem' }} 
        onClick={() => setIsVisible(true)}
      />

      <Modal
        visible={isVisible}
        title="Editar ausencia ou indisponibilidade"
        onCancel={() => setIsVisible(false)}
        onOk={() => document.getElementById(`edit-${item.id}`).click()}
        width={"50%"}
        loading={loading}
      >
        <Form layout="vertical" onSubmitCapture={handleSubmit(onSubmit)}>
          <Form.Item label="Título">
            <input
              className="uk-input"
              value={payload?.title}
              onChange={(e) =>
                setPayload({ ...payload, title: e.target.value })
              }
            />
          </Form.Item>
          <div className="uk-flex uk-flex-between" style={{ gap: "10px" }}>
            <Form.Item label="Data de inicio" className="uk-width-1-4">
              <Space>
                <DatePicker
                  value={payload?.startDate}
                  placeholder="dd/mm/aaaa"
                  className=""
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      startDate: e,
                    })
                  }
                  format="DD/MM/YYYY"
                />
              </Space>
            </Form.Item>
            <Form.Item label="Data de saida" className="uk-width-1-4">
              <Space>
                <DatePicker
                  value={payload?.endDate}
                  placeholder="dd/mm/aaaa"
                  className=""
                  onChange={(e) =>
                    setPayload({
                      ...payload,
                      endDate: e,
                    })
                  }
                  format="DD/MM/YYYY"
                />
              </Space>
            </Form.Item>
            <Form.Item label="Hora de inicio" className="uk-width-1-4">
              <Space>
                <TimePicker
                  value={payload.startHour}
                  format="HH:mm"
                  onChange={(e) => {
                    setPayload({ ...payload, startHour: moment(e) });
                  }}
                />
              </Space>
            </Form.Item>
            <Form.Item label="Hora de saída" className="uk-width-1-4">
              <Space>
                <TimePicker
                  value={payload.endHour}
                  format="HH:mm"
                  onChange={(e) => {
                    setPayload({ ...payload, endHour: moment(e) });
                  }}
                />
              </Space>
            </Form.Item>
          </div>
          <Form.Item>
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
                  checked={
                    day.label === "terça"
                      ? frequency.includes("terca") ||
                        frequency.includes("terça")
                      : frequency.includes(day.label)
                  }
                >
                  {day.label}
                </Checkbox>
              );
            })}
            <Checkbox
              checked={frequency.length === 7}
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
          <input
            type="submit"
            id={`edit-${item.id}`}
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
    </div>
  );
};
