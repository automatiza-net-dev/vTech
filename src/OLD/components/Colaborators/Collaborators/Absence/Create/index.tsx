import { useCallback, useState } from "react";

import { useRouter } from "next/router";

import moment from "moment";
import { useForm } from "react-hook-form";
import { useToast } from "infinity-forge";
import { useMutation } from "@/presentation/use-query";
import { useQueryClient } from "@/presentation/use-query";
import { Form, Modal, Checkbox, DatePicker, Space } from "antd";

import { days } from "./weekdays";
import { calendarService } from "@/OLD/services/calendar.service";

import "moment/locale/pt-br";

export function Create(props?: {
  userId: string;
  onSucess?: () => void;
  Component: ({ onClick }) => React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [frequency, setFrequency] = useState<any>([]);
  const [allChecked, setAllChecked] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const userId = props?.userId || router.query.id;

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { createToast } = useToast();
  const [payload, setPayload] = useState<any>({
    userId,
  });

  const { mutate } = useMutation({
    queryKey: ["createSeila"],
    queryFn: (data: any) =>
      calendarService.createAbsence({ ...data, ...payload }),
    onError: (error: any) => {
      error?.response?.data?.errors?.forEach((err) =>
        createToast({ message: err?.message, status: "error" })
      );
    },
    onSuccess: () => {
      createToast({
        message: "Sucesso ao cadastrar indisponibilidade",
        status: "success",
      });
      props?.onSucess?.();
      setIsVisible(false);
      queryClient.invalidateQueries(["getAbsences"]);
      setPayload({
        userId,
      });
    },
  });

  const onSubmit = useCallback(() => {
    if (frequency.includes("terça")) {
      const index = frequency.indexOf("terça");
      frequency[index] = "terca";
    }

    if (frequency.length === 0) {
      createToast({ message: "Marque pelo menos um dia", status: "error" });
    } else {
      mutate({ ...payload, frequency });
    }
  }, [payload, frequency]);

  return (
    <div>
      {props?.Component && (
        <props.Component onClick={() => setIsVisible(true)} />
      )}

      {!props?.Component && (
        <Button
          text="Adicionar bloqueio de agenda"
          onClick={() => setIsVisible(true)}
        />
      )}

      {isVisible && (
        <Modal
          visible={isVisible}
          title="Novo bloqueio de agenda"
          onCancel={() => {
            setIsVisible(false);
            setPayload({
              userId,
              endHour: null,
              startHour: null,
            });
          }}
          onOk={() => document.getElementById("create")?.click()}
          width={"50%"}
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
                    let newArr: any = [];
                    days.map((item: any) => {
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
}

export function BlockUserButton(props: {
  userId: string;
  onSucess?: () => void;
  Component: ({ onClick }) => React.ReactNode;
}) {
  return <Create {...props} />;
}
