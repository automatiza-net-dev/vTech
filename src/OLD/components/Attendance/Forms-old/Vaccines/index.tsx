import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { vaccinesService } from "@/OLD/services/vaccine-service";

import { RemoteChangeStatus } from "@/data";
import { useLoadPatient, useLoadAllScheduleStatuses, useQueryClient } from "@/presentation";
import { container, patientTypes } from "@/container";

import moment from "moment";
import "moment/locale/pt-br";

import { Input, DatePicker } from "antd";
import {
  Select,
  FormHandler,
  Button,
  useToast,
} from "infinity-forge";
import { Container } from "./styles";

function Vaccines({ modal, setModal, value, reloadSchedule }) {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [allProtocols, setAllProtocols] = useState<any>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<any>({});
  const [applications, setApplications] = useState<any>([]);

  const { createToast } = useToast();

  const router = useRouter();
  const patient = useLoadPatient();
  const eventId = router.query.scheduleId;
  const scheduleStatuses = useLoadAllScheduleStatuses();

  const { refetch } = useQueryClient();

  const getProtocols = useCallback(() => {
    setLoading(true);
    vaccinesService
      .listProtocols({
        specie: patient?.data?.specie_id || "",
        type: value === "Vacinas" ? "vaccine" : "vermifuge",
      })
      .then((res) => {
        setAllProtocols(
          res.data.map((item) => {
            return {
              label: `${item?.vaccine?.name} - ${item?.name} - ${item?.doses} x ${item.interval}`,
              doses: item?.doses,
              interval: item?.interval,
              id: item?.id,
              vaccineId: item?.vaccine?.id,
            };
          })
        );
      })
      .catch((_err) => {
        setLoading(false);
        return createToast({
          message: "Não foi possível recuperar os protocolos disponíveis...",
          status: "error",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patient]);

  useEffect(() => {
    getProtocols();
  }, []);

  const submitVaccine = useCallback(async () => {
    setLoading(false);
    const applicationsData = applications.map((item: any) => {
      return {
        ...item,
        date: moment(item?.date),
      };
    });
    vaccinesService
      .launchVaccine({
        vaccineId: selectedProtocol?.vaccineId,
        vaccineProtocolId: selectedProtocol?.id,
        patientId: patient?.data?.id,
        scheduleId: eventId,
        applications: applicationsData,
      })
      .then(async (_res) => {
        // setLoading(false);
        // setModal(false);
        // setData({});
        // setApplications([]);
        await refetch(["LastUpdates", patient.data?.id]);
        await refetch(["LoadAllVaccines"], { mode: "include" });

        if (
          router?.query?.scheduleId &&
          patient?.data?.scheduleId &&
          !patient?.data?.scheduleStartedAt
        ) {
          const statusId =
            scheduleStatuses.data?.find((status) => status.type === "ATEND")
              ?.id || "";

          await container
            .get<RemoteChangeStatus>(patientTypes.RemoteChangeStatus)
            .change({
              scheduleId: router.query.scheduleId as string,
              statusId,
            });

          reloadSchedule && reloadSchedule();
        }

        return createToast({
          message: "Vacina lançada com sucesso!",
          status: "success",
        });
      })
      .catch((err) => {
        setLoading(false);
        return createToast({
          message: `${err.response.data.errors[0].message}`,
          status: "error",
        });
      });
  }, [data, selectedProtocol, applications, eventId, patient]);

  return (
    <Container>
      <h4>Lançamento de {value}</h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitVaccine();
        }}
      >
        <div>
          <label>Protocolos</label>
          <br />
          {allProtocols && allProtocols.length > 0 && (
            <FormHandler>
              <Select
                menuPlacement="bottom"
                name="exam"
                options={allProtocols.map((protocol) => ({
                  label: protocol?.label,
                  value: protocol?.id,
                }))}
                disabled={!modal}
                onlyOneValue
                onChangeInput={async (value) => {
                  const selected = allProtocols.find(
                    (item) => item.id === value
                  );
                  setData({ ...data, protocolId: value, doses: selected.doses, interval: selected.interval });
                  setSelectedProtocol(selected);
                  setApplications(
                    Array.from(Array(selected.doses), (_, i) => i + 1).map(
                      (item, i) => {
                        return {
                          dose: item,
                          date:
                            item === 1
                              ? moment(new Date())
                              : moment(new Date()).add(
                                (item - 1) * selected.interval,
                                "days"
                              ),
                        };
                      }
                    )
                  );
                }}
              />
            </FormHandler>
          )}
        </div>
        {data?.protocolId && (
          <div className="uk-margin-top">
            <div className="uk-width-1-2">
              <label>Inicio da aplicação</label>
              <br />
              <DatePicker
                format="DD/MM/YYYY"
                className="uk-margin-right"
                value={applications[0]?.date}
                onChange={(e) => {
                  setApplications(
                    Array.from(Array(data.doses), (_, i) => i + 1).map(
                      (item, i) => {
                        return {
                          dose: item,
                          date:
                            item === 1
                              ? moment(e)
                              : moment(e).add(
                                (item - 1) * data.interval,
                                "days"
                              ),
                        };
                      }
                    )
                  );
                }}
              />
            </div>
            <section className="uk-flex">
              <div className="uk-margin-top uk-width-1-6 uk-margin-small-right">
                <label>Dose</label>
                {applications.length > 0 &&
                  applications.map((item) => (
                    <Input disabled={true} value={item?.dose} />
                  ))}
              </div>
              <div className="uk-margin-top uk-width-1-1">
                <label> Data prevista </label>
                {applications.length > 0 &&
                  applications.map((item, i) => (
                    <div>
                      <DatePicker
                        format={"DD/MM/YYYY"}
                        value={item?.date}
                        onChange={(e) => {
                          const obj = [...applications];
                          obj.splice(i, 1, {
                            ...item,
                            date: e,
                          });
                          setApplications(obj);
                        }}
                      />
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}
        <hr />
        <div className="uk-flex uk-flex-right">
          <div className="uk-margin-top uk-flex uk-width-1-2 uk-flex-right">
            <Button
              type="submit"
              loading={loading}
              text="Salvar"
              style={{ marginRight: "10px" }}
            />

            <Button
              onClick={() => setModal(false)}
              text="Cancelar"
              type="button"
              style={{ backgroundColor: "#ff7b5a" }}
            />
          </div>
        </div>
      </form>
    </Container>
  );
}

export default Vaccines;
