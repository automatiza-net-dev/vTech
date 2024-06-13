import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

import { animalServices } from "@/OLD/services/animal.service";

import { useAuth } from "@/OLD/hooks/useAuth";
// import { useTutor } from "@/OLD/hooks/useTutor";
import { useSchedule } from "@/OLD/hooks/useSchedules";
import { useUniquetutorOrigins } from "@/OLD/hooks/useTutorOrigins";

import { Edit } from "@/OLD/components/Tutor/Edit";
import { Edit as EditPatient } from "@/OLD/components/Patient/Edit";
// import { Create as CreatePatient } from "@/OLD/components/Patient/Create";

import {
  Input,
  AutoComplete,
  Select,
  Popconfirm,
  Switch,
  notification,
  Button,
  Tooltip,
  Modal,
} from "antd";
import { DatePicker } from "@mui/x-date-pickers";
const { Option } = Select;
const { TextArea } = Input;
import { Container } from "./styles";
import { Button as CustomButton } from "@/OLD/components/mini-components/Button";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

export default function FormChild({
  clients,
  colaborators,
  crmStatus,
  contactTypes,
  subjects,
  data,
  setData,
  submit,
  type = "create",
  prvsValues = false,
  setVisible = false,
  footer = true,
  edit,
  setEdit,
  reload,
  setReload,
}: any) {
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [scheduleDetailsVisible, setScheduleDetailsVisible] = useState(false);
  const [scheduleId, setScheduleId] = useState(false);
  const [refreshAutoComplete, setRefreshAutoComplete] = useState(false);
  const [races, setRaces] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState<any>({});
  const [editTutorVisible, setEditTutorVisible] = useState(false);
  const [editPatientVisible, setEditPatientVisible] = useState(false);
  const [createPatientVisible, setCreatePatientVisible] = useState(false);

  const { setOriginConfig, setCrmData } = useAuth();
  // const { tutors } = useTutor(false, reload);
  const { uniqueOrigins } = useUniquetutorOrigins(data?.tutorOriginId);

  // sortItems(tutors, "name");

  const router = useRouter();

  const getAllRaces = useCallback(() => {
    animalServices
      .getRaces({ description: "" } as any)
      .then((res) => {
        res.sort((a, b) => {
          const valueA =
            `${a.specie.description} > ${a.description}`.toUpperCase();
          const valueB =
            `${b.specie.description} > ${b.description}`.toUpperCase();
          return valueA.localeCompare(valueB);
        });
        setRaces(
          res.map((race) => {
            return {
              value: `${race.specie.description} > ${race.description}`,
              id: race.id,
            };
          })
        );
      })
      .catch((err) => {
        notification.error({
          message: "Houve um erro ao obter as raças disponíveis",
        });
      });
  }, [refreshAutoComplete]);

  useEffect(() => {
    getAllRaces();
  }, [refreshAutoComplete, router]);

  useEffect(() => {
    setSelectedOrigin(clients?.find((origin) => origin?.id === data?.originId));
  }, [data, clients]);

  const verifyFields = () => {
    if (!data?.contactDate) {
      return notification.warning({ message: "Informe a data do contado" });
    }
    if (!data?.statusId) {
      return notification.warning({ message: "Informe o status" });
    }
    if (!data?.userId) {
      return notification.warning({ message: "Informe o responsável" });
    }
    return "ok";
  };

  useEffect(() => {
    prvsValues && setData({ ...data, ...prvsValues });
  }, [prvsValues]);

  useEffect(() => {
    type === "create" &&
      setData({
        ...data,
        statusId: crmStatus.find(
          (st) => st?.description === "Nova Oportunidade"
        )?.id,
      });
  }, [type, crmStatus]);

  return (
    <Container
      onSubmit={(e) => {
        e.preventDefault();
        type === "create" ? verifyFields() === "ok" && submit() : submit();
        setEdit && setEdit(false);
      }}
    >
      <div className="body-form uk-padding-small">
        <div className="uk-flex uk-flex-between">
          <div className="uk-width-1-1 uk-margin-small-right">
            <Tooltip
              title={
                process.env.client !== "liftone"
                  ? "Clique para editar dados do tutor"
                  : "Clique para editar os dados do cliente"
              }
            >
              <label
                className="uk-link"
                onClick={() => {
                  setCrmData(data);
                  setOriginConfig("Crm");
                  setEditTutorVisible(true);
                  // router.push(`/dashboard/tutor/editar/${data?.contactId}`);
                }}
              >
                {process.env.client !== "liftone" ? "Tutor" : "Cliente"}
              </label>
            </Tooltip>
            <Input value={data?.tutorName} disabled />
            {/*
            <AutoComplete
              className="uk-width-1-1"
              disabled={!footer ? !edit : false}
              options={tutors?.map((tutor) => ({
                ...tutor,
                value: tutor?.name,
                key: tutor?.id
              }))}
              value={data?.tutorName}
              onChange={(val) => setData({ ...data, tutorName: val })}
              onSelect={(_, opt) => {
                setSelectedPatients(opt?.dependents);
                setData({
                  ...data,
                  tutorName: opt?.value,
                  contactId: opt?.id,
                  contact: opt
                });
              }}
              filterOption={(val, opt) =>
                normalizeStr(opt?.value.toUpperCase()).includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
            */}
          </div>
          <div className="uk-width-1-1 uk-margin-right">
            <label>Telefone</label>
            <Input
              disabled={true}
              value={
                data?.contact?.cellphone || data?.contact?.tutor?.cellphone
              }
            />
          </div>
          <div>
            {!footer && (
              <div className="uk-flex uk-flex-right uk-margin-remove">
                {!edit && (
                  <>
                    {data?.closingDate === "-" && !data?.balance && (
                      <div>
                        <CustomButton
                          classCallback="uk-margin-right"
                          onClick={() => setEdit(true)}
                        >
                          Editar
                        </CustomButton>
                      </div>
                    )}
                    <div>
                      <CustomButton onClick={() => router.back()}>
                        Voltar
                      </CustomButton>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {process.env.client !== "liftone" && (
          <div className="uk-flex uk-flex-between uk-margin-small-top">
            <div className="uk-width-1-4 uk-margin-small-right">
              <div className="uk-width-1-1">
                <label
                  className="uk-link"
                  onClick={() => {
                    setOriginConfig("Crm");
                    data?.clientId
                      ? setEditPatientVisible(true)
                      : setCreatePatientVisible(true);
                    /*
                      ? router.push(
                          `/dashboard/paciente/editar/${data?.clientId}`
                        )
                      : router.push(
                          `/dashboard/paciente/criar/${data?.contactId}`
                        );*/
                  }}
                >
                  Pet
                </label>
                <AutoComplete
                  disabled={
                    !footer ? !edit : false || selectedPatients.length === 0
                  }
                  className="uk-width-1-1"
                  options={selectedPatients?.map((patient: any) => ({
                    ...patient,
                    value: patient?.name,
                    key: patient?.id,
                  }))}
                  value={data?.patientName}
                  onChange={(val) => setData({ ...data, patientName: val })}
                  onSelect={(_val, opt) => {
                    setData({
                      ...data,
                      clientId: opt?.id,
                      patientName: opt?.value,
                    });
                  }}
                  filterOption={(val, opt) =>
                    normalizeStr(opt?.value.toUpperCase()).includes(
                      normalizeStr(val?.toUpperCase())
                    )
                  }
                />
              </div>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <div className="uk-width-1-1">
                <label>{`Espécie > Raça do pet`}</label>
                <AutoComplete
                  value={data?.raceDescription}
                  disabled={!footer ? !edit : false}
                  className="uk-width-1-1"
                  onChange={(e: any) => {
                    const choosed = races.find(
                      (option: any) => option.value === e
                    ) as any;
                    setData({
                      ...data,
                      raceId: choosed?.id,
                      raceDescription: choosed?.value,
                    });
                  }}
                  placeholder="Digite o nome da raça"
                  filterOption={(inputValue: any, option: any) =>
                    option.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                >
                  {races.map((option: any, key) => {
                    return (
                      <Option key={key} value={option.value}>
                        {option.value}
                      </Option>
                    );
                  })}
                </AutoComplete>
              </div>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <label>Genero</label>
              <Select
                disabled={!footer ? !edit : false}
                className="uk-width-1-1"
                id={"gender"}
                value={data?.gender}
                onChange={(e) => setData({ ...data, gender: e })}
              >
                <option value="male">Macho</option>
                <option value="female">Fêmea</option>
              </Select>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <label>Castrado</label>
              <Select
                disabled={!footer ? !edit : false}
                className="uk-width-1-1"
                value={data?.castrated}
                onChange={(val) => setData({ ...data, castrated: val })}
              >
                <Option value="true">Sim</Option>
                <Option value="false">Não</Option>
              </Select>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <label>Peso (Kg)</label>
              <Input
                disabled={!footer ? !edit : false}
                value={data?.weight}
                onChange={(e) => {
                  setData({
                    ...data,
                    weight: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        )}
        <section className="uk-flex uk-flex-between uk-margin-top">
          <div className="uk-width-1-3 uk-margin-small-right">
            <label>Data Contato</label>
            <br />
            <DatePicker
              slotProps={{ textField: { variant: "standard" } }}
              disabled={!footer ? !edit : false}
              className="uk-width-1-1"
              format="DD/MM/YYYY"
              value={data?.contactDate}
              onChange={(val) => setData({ ...data, contactDate: val })}
            />
          </div>
          <div className="uk-width-1-3 uk-margin-small-right">
            <label>Responsável Oportunidade</label>
            <AutoComplete
              disabled={!footer ? !edit : false}
              className="uk-width-1-1"
              options={colaborators.map((collab) => ({
                ...collab,
                value: collab?.name,
                key: collab?.id,
              }))}
              value={data?.collabName}
              onChange={(val) => setData({ ...data, collabName: val })}
              onSelect={(_, opt) => {
                setData({ ...data, userId: opt?.id, collabName: opt?.value });
              }}
              filterOption={(val: any, opt: any) =>
                normalizeStr(opt?.value.toUpperCase()).includes(
                  normalizeStr(val?.toUpperCase())
                )
              }
            />
          </div>
          <div className="uk-width-1-3 uk-margin-small-right">
            <label>Status</label>
            <Select
              disabled={!footer ? !edit : false}
              className="uk-width-1-1"
              value={data?.statusId}
              onChange={(val) => setData({ ...data, statusId: val })}
            >
              {crmStatus.length > 0 &&
                crmStatus?.map((status) => (
                  <Option value={status?.id}>{status?.description}</Option>
                ))}
            </Select>
          </div>
          {type === "update" && (
            <div className="uk-flex uk-flex-right">
              <div className="">
                <label>Ativo</label>
                <br />
                <Switch
                  disabled={!footer ? !edit : false}
                  checked={data?.active}
                  onChange={(val) => setData({ ...data, active: val })}
                />
              </div>
            </div>
          )}
        </section>
        <section className="uk-flex uk-flex-between uk-margin-top">
          <>
            <div className="uk-width-1-4 uk-margin-small-right">
              <label>Tipo do contato</label>
              <Select
                disabled={!footer ? !edit : false}
                className="uk-width-1-1"
                value={data?.contactTypeId}
                onChange={(val) => setData({ ...data, contactTypeId: val })}
              >
                {contactTypes?.length > 0 &&
                  contactTypes?.map((contact) => (
                    <Option value={contact?.id}>{contact?.description}</Option>
                  ))}
              </Select>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <div className="uk-margin-small">
                <label>Como conheceu a clinica</label>
                <AutoComplete
                  disabled={!footer ? !edit : false}
                  className="uk-width-1-1"
                  options={clients?.map((origin) => ({
                    ...origin,
                    value: origin?.description,
                    key: origin?.id,
                  }))}
                  value={data?.originDescription}
                  onChange={(val) =>
                    setData({ ...data, originDescription: val })
                  }
                  onSelect={(_, opt) => {
                    setData({
                      ...data,
                      originId: opt?.id,
                      originDescription: opt?.value,
                    });
                    setSelectedOrigin(opt);
                  }}
                  filterOption={(val, opt: any) =>
                    normalizeStr(opt?.value.toUpperCase()).includes(
                      normalizeStr(val?.toUpperCase())
                    )
                  }
                />
              </div>
            </div>
            {selectedOrigin?.default && (
              <div className="uk-width-1-4 uk-margin-small-right">
                <label>Campanha mídia</label>
                <AutoComplete
                  disabled={!footer ? !edit : false}
                  className="uk-width-1-1"
                  options={uniqueOrigins?.sort().map((item) => ({
                    value: item,
                    key: item,
                  }))}
                  value={data?.clientOriginItemDescription}
                  onChange={(val) =>
                    setData({ ...data, clientOriginItemDescription: val })
                  }
                  onSelect={(_, opt) =>
                    setData({
                      ...data,
                      clientOriginItemDescription: opt?.value,
                    })
                  }
                  filterOption={(inputValue, option: any) =>
                    option.value
                      .toUpperCase()
                      .includes(inputValue.toUpperCase())
                      ? option
                      : null
                  }
                />
              </div>
            )}
            <div className="uk-width-1-4">
              <label>Assunto Contato</label>
              <Select
                disabled={!footer ? !edit : false}
                className="uk-width-1-1"
                value={data?.contactSubjectId}
                onChange={(val) => setData({ ...data, contactSubjectId: val })}
              >
                {subjects.length > 0 &&
                  subjects?.map((subject) => (
                    <Option value={subject?.id}>{subject?.description}</Option>
                  ))}
              </Select>
            </div>
          </>
        </section>
        <div className="uk-flex uk-flex-around">
          <div className="uk-margin-top uk-width-1-4 uk-margin-small-right">
            <label>Valor oportunidade (R$)</label>
            <Input
              disabled={!footer ? !edit : false}
              value={data?.value}
              onChange={(e) => {
                setData({
                  ...data,
                  value: currencyFormatter(convertIntlCurrency(e.target.value)),
                });
              }}
            />
          </div>
          <div className="uk-margin-top uk-width-1-1">
            <label>Título</label>
            <Input
              disabled={!footer ? !edit : false}
              value={data?.description}
              onChange={(e) =>
                setData({ ...data, description: e.target.value })
              }
            />
          </div>
        </div>
        <div className="uk-margin-top">
          <label>Observação</label>
          <TextArea
            disabled={!footer ? !edit : false}
            value={data?.observation}
            onChange={(e) => setData({ ...data, observation: e.target.value })}
          />
        </div>
        {data?.closing_date && (
          <>
            <hr />
            <section>
              <div>
                {data?.schedule?.id ? (
                  <span className="uk-link" onClick={() => {}}>
                    Visualizar agendamento
                  </span>
                ) : (
                  <span className="uk-text-muted">
                    Nenhum agendamento vinculado
                  </span>
                )}
              </div>
              <div className="uk-flex" style={{ gap: "5px" }}>
                <div className="uk-margin-small-top">
                  <label>Usuário fechamento</label>
                  <Input disabled value={data?.closingUser || "-"} />
                </div>
                <div className="uk-margin-small-top">
                  <label>Dt. de Fechamento</label>
                  <Input disabled value={data?.closingDate} />
                </div>
                <div className="uk-margin-small-top">
                  <label>Valor</label>
                  <Input disabled value={data?.profit_value} />
                </div>
                <div className="uk-margin-small-top">
                  <label>Ganho / Perda</label>
                  <Input disabled value={data?.gain} />
                </div>
                <div className="uk-margin-small-top">
                  <label>Motivo ganho/perda</label>
                  <Input disabled value={data?.reason?.description || "-"} />
                </div>
              </div>
              <div className="uk-margin-small-top">
                <label>Observação</label>
                <TextArea disabled value={data?.result_observation || "-"} />
              </div>
            </section>
          </>
        )}
      </div>
      {(footer || edit) && (
        <>
          {type === "create" ? (
            <footer className="uk-flex uk-margin-top">
              <CustomButton type="submit">Salvar</CustomButton>
              <Popconfirm
                title="Deseja descartar alterações ?"
                onConfirm={() => router.back()}
              >
                <CustomButton classCallback="uk-margin-left">
                  Cancelar
                </CustomButton>
              </Popconfirm>
            </footer>
          ) : (
            <>
              <hr />
              <footer className="uk-flex uk-flex-right">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="uk-margin-small-right"
                >
                  Salvar
                </Button>
                <Button
                  onClick={() => {
                    footer ? setVisible(false) : setEdit(false);
                    setReload((prv) => !prv);
                  }}
                >
                  Cancelar
                </Button>
              </footer>
            </>
          )}
        </>
      )}

      {/* {scheduleDetailsVisible && (
        <ConsultDetails
          item={schedule}
          visible={scheduleDetailsVisible}
          setVisible={setScheduleDetailsVisible}
          reload={reload}
        />
      )} */}
      {editTutorVisible && (
        <Modal
          width={1200}
          visible={editTutorVisible}
          onCancel={() => setEditTutorVisible(false)}
          footer={null}
        >
          <Edit tutorId={data?.contactId} setVisible={setEditTutorVisible} />
        </Modal>
      )}
      {editPatientVisible && (
        <Modal
          visible={editPatientVisible}
          footer={null}
          onCancel={() => setEditPatientVisible(false)}
          width={1200}
        >
          <EditPatient id={data?.clientId} setVisible={setEditPatientVisible} />
        </Modal>
      )}
      {createPatientVisible && (
        <Modal
          visible={createPatientVisible}
          footer={null}
          onCancel={() => setCreatePatientVisible(false)}
          width={1200}
        >
          back_component_this_part_code
          {/* <CreatePatient setVisible={setCreatePatientVisible} /> */}
        </Modal>
      )}
    </Container>
  );
}
