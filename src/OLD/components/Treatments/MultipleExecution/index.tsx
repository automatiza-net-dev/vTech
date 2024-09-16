// @ts-nocheck
import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import { treatmentService } from "@/OLD/services/treatments.service";

import {
  useTreatment,
  useSearchDateExecutions,
} from "@/OLD/hooks/useTreatment";
import { useColaborators } from "@/OLD/hooks/useColaborators";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import {
  Input,
  DatePicker,
  Tooltip,
  AutoComplete,
  TimePicker,
  notification,
  Popconfirm,
} from "antd";
import { Button } from "infinity-forge";
const { TextArea } = Input;

import moment from "moment";
import { normalizeStr } from "@/OLD/utils/normalizeString";

const MultipleExecution = memo(function MultipleExecution() {
  const [reload, setReload] = useState(false);
  const [filters, setFilters] = useState({});
  const [formattedExecutions, setFormattedExecutions] = useState([]);
  const [data, setData] = useState({});
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { treatment } = useTreatment(router.query.id, reload);
  const { executions } = useSearchDateExecutions(filters);
  const { colaborators } = useColaborators();

  const dayExecutionsPermission = useUserHasPermission("TRA02");

  useEffect(() => {
    setFilters({
      treatment: router.query.id,
      date: moment(new Date()).startOf("day").toISOString(),
    });
  }, []);

  useEffect(() => {
    formatExecutions();
  }, [executions]);

  const formatExecutions = () => {
    const executionsArr = [];
    executions.map((treatment) =>
      treatment?.executions?.map((execution) => {
        if (
          execution?.status === "Ativo" &&
          moment(execution?.scheduling?.date).format("DD/MM/YYYY") ===
            moment(new Date()).format("DD/MM/YYYY")
        ) {
          executionsArr.push({
            ...execution,
            item: treatment?.items?.find(
              (item) => item?.id === execution?.item_id
            ),
          });
        }
      })
    );
    setFormattedExecutions(executionsArr);
  };

  const submitExecutions = useCallback(() => {
    setLoading(true);
    treatmentService
      .batchCompleteExecution({
        treatmentId: router?.query?.id,
        observations: data?.observations,
        executionUser: data?.executionUser,
        executionList: formattedExecutions
          .map(({ id, quantityExecuted, item_id }) => ({
            id,
            quantity: quantityExecuted,
            itemId: item_id,
          }))
          .filter((item) => item?.quantity > 0),
        executionDate: moment(data?.date).toISOString(),
      })
      .then((_res) => {
        router.back();
        setLoading(false);
        return notification.success({
          message: "Execuções completas com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        notification.error({ message: "Verifique os campos informados" });
      });
  }, [data, JSON.stringify(router), formattedExecutions]);

  return (
    <Container className="uk-padding">
      <h3 className="uk-margin-remove">Execuções do dia</h3>
      <section className="custom-body uk-padding">
        <div className="uk-flex">
          <div className="uk-margin-right uk-width-1-5">
            <label>Cód. Tratamento</label>
            <Input value={treatment?.id} disabled />
          </div>
          <div className="uk-margin-right">
            <label>Data</label>
            <br />
            <DatePicker
              format="DD/MM/YYYY"
              value={moment(treatment?.emissionDate)}
              disabled
            />
          </div>
          <div className="uk-width-1-2 uk-margin-right">
            <label>Cliente</label>
            <Input
              value={treatment?.client?.name}
              className="uk-width-1-1"
              disabled
            />
          </div>
          <div className="uk-width-1-2">
            <label>Vendedor</label>
            <Input
              value={treatment?.seller?.name}
              className="uk-width-1-1"
              disabled
            />
          </div>
        </div>
        <div className="uk-margin-small-top">
          <div className="uk-flex uk-flex-center uk-margin-small-top">
            <div className="uk-margin-right">
              <label>Data agendamento</label>
              <br />
              <span className="uk-link">
                {moment(formattedExecutions[0]?.scheduling?.date).format(
                  "DD/MM/YYYY"
                )}
              </span>
            </div>
            <div className="uk-margin-right">
              <label>Profissional Responsável</label>
              <AutoComplete
                className="uk-width-1-1"
                value={values?.collabName}
                options={colaborators.map((colab) => ({
                  ...colab,
                  value: colab?.name,
                }))}
                onChange={(val) => setValues({ ...values, collabName: val })}
                onSelect={(_val, opt) => {
                  setValues({ ...values, collabName: opt?.value });
                  setData({ ...data, executionUser: opt?.id });
                }}
                filterOption={(val, opt) =>
                  normalizeStr(opt?.value.toUpperCase()).includes(
                    normalizeStr(val.toUpperCase())
                  )
                }
              />
            </div>
            <div className="uk-margin-small-right">
              <label>Data Execução</label>
              <DatePicker
                format="DD/MM/YYYY - HH:mm"
                showTime
                className="uk-width-1-1"
                value={data?.date}
                onChange={(val) => setData({ ...data, date: val })}
              />
            </div>
          </div>
          <div className="uk-margin-small-top">
            <label>Observação</label>
            <TextArea
              value={data?.observations}
              onChange={(e) =>
                setData({ ...data, observations: e.target.value })
              }
            />
          </div>
          <hr />
        </div>
        <h5 className="uk-heading-line">
          <span>Execuções</span>
        </h5>
        {formattedExecutions?.length === 0 ? (
          <div className="uk-text-center">
            <span className="uk-text-muted">
              Nenhuma execução marcada para hoje
            </span>
          </div>
        ) : (
          <div>
            <section className="uk-flex uk-flex-between">
              <div className="uk-width-1-3">Descrição</div>
              <div className="uk-width-1-5">Qtd. Agendada</div>
              <div>Qtd. Execução</div>
            </section>
            {formattedExecutions.map((exec, i) => (
              <>
                <section className="uk-flex uk-flex-between item-box">
                  <div className="uk-width-1-3">{exec?.item?.description}</div>
                  <div className="uk-width-1-5">{exec?.scheduledQuantity}</div>
                  <div className="custom-width">
                    <Input
                      value={formattedExecutions[i].quantityExecuted}
                      onChange={(e) => {
                        if (e.target.value > exec?.scheduledQuantity) {
                          return notification.warning({
                            message:
                              "A quantidade executada não pode ultrapassar a quantidade agendada",
                          });
                        }

                        let executionsArr = [...formattedExecutions];
                        executionsArr.splice(i, 1, {
                          ...executionsArr[i],
                          quantityExecuted: e.target.value,
                        });
                        setFormattedExecutions(executionsArr);
                      }}
                    />
                  </div>
                </section>
              </>
            ))}
          </div>
        )}
      </section>
      <footer className="uk-margin-top">
        {dayExecutionsPermission && (
          <Popconfirm
            title="Deseja completar execuções do dia?"
            onConfirm={() => !loading && submitExecutions()}
          >
            <Button text={!loading ? "Salvar" : "Carregando..."} />
          </Popconfirm>
        )}
        <Popconfirm
          title="Descartar alterações?"
          onConfirm={() => router.back()}
        >
          <Button text="Cancelar" />
        </Popconfirm>
      </footer>
    </Container>
  );
});

export default MultipleExecution;
