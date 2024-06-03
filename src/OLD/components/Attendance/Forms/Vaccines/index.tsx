// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useRouter } from "next/router";

import { vaccinesService } from "@/OLD/services/vaccine-service";

import moment from "moment";
import "moment/locale/pt-br";

import {
  Modal,
  Input,
  DatePicker,
  Select,
  notification,
  Button,
} from "antd";
const { Option } = Select;

const Vaccines = memo(function Vaccines({
  patient,
  reload,
  setReload,
  visible,
  setVisible,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [allProtocols, setAllProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState({});
  const [applications, setApplications] = useState([]);
  const { user } = useProfile();
  const router = useRouter();
  const eventId = router.query.innerpage;

  const getProtocols = useCallback(() => {
    setLoading(true);
    vaccinesService
      .listProtocols({ specieId: patient?.patientAnimal?.race?.specie_id })
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
        return notification.error({
          message: "Não foi possível recuperar os protocolos disponíveis...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [patient]);

  useEffect(() => {
    visible && getProtocols();
  }, [visible, getProtocols]);

  const submitVaccine = useCallback(async () => {
    setLoading(false);
    const applicationsData = applications.map((item) => {
      return {
        ...item,
        date: moment(item?.date),
      };
    });
    vaccinesService
      .launchVaccine({
        vaccineId: selectedProtocol?.vaccineId,
        vaccineProtocolId: selectedProtocol?.id,
        patientId: patient?.id,
        scheduleId: eventId,
        applications: applicationsData,
      })
      .then((_res) => {
        return notification.success({
          message: "Vacina lançada com sucesso!",
        });
      })
      .catch((err) => {
        setLoading(false);
        return notification.error({
          message: `${err.response.data.errors[0].message}`,
        });
      })
      .finally(() => {
        setLoading(false);
        setReload(!reload)
        setVisible(false);
        setData({});
        setApplications([]);
      });
  }, [data, selectedProtocol, applications, eventId, patient]);

  return (
    <div>
      <Modal
        title={`Lançamento de vacina - Paciente: ${patient?.name}`}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitVaccine();
          }}
        >
          <div>
            <label>Vacinas - Protocolos</label>
            <br />
            <Select
              className="uk-width-1-1"
              value={
                data?.protocolId
                  ? allProtocols.find((item) => item?.id === data?.protocolId)
                      ?.label
                  : null
              }
              onChange={(e) => {
                setData({ ...data, protocolId: e });
                const selected = allProtocols.find((item) => item.id === e);
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
            >
              {allProtocols.length > 0 &&
                allProtocols.map((item, i) => (
                  <Option key={i} value={item.id}>
                    {item?.label}
                  </Option>
                ))}
            </Select>
          </div>
          {data?.protocolId && (
            <div className="uk-margin-top">
              <div className="uk-width-1-2">
                <label>Inicio da aplicação</label>
                <br />
                <DatePicker
                  format="DD/MM/YYYY"
                  className="uk-margin-right"
                  value={applications[0].date}
                  onChange={(e) => {
                    const obj = [...applications];
                    obj.splice(0, 1, {
                      ...applications[0],
                      date: e,
                    });
                    setApplications(obj);
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
          <div className="uk-flex uk-flex-right">
            <div className="uk-margin-top uk-flex uk-flex-between uk-width-1-2">
              <Button type="primary" htmlType="submit" loading={loading}>
                Salvar
              </Button>
              <Button onClick={() => setVisible(false)}>Cancelar</Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
});

export default Vaccines;
