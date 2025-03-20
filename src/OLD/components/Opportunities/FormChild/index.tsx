import { useRouter } from "next/router";
import React, { useEffect, useState, useCallback } from "react";

import { RemoteCRM } from "@/data";

import { Input, AutoComplete, Switch, Select as SelectAnt, Modal } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import {
  FormHandler,
  Select,
  Button,
  useAuthAdmin,
  useToast,
} from "infinity-forge";

import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { animalServices } from "@/OLD/services/animal.service";

import {
  FormCreatePatient,
  FormCreateTutor,
  useLoadCampaings,
  useConfigurationsSystem,
} from "@/presentation";
import { SelectMidia } from "./select-midia";
import { container, TypesAutomatiza } from "@/container";
import { Edit as EditPatient } from "@/OLD/components/Patient/Edit";

import { normalizeStr } from "@/OLD/utils/normalizeString";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

import { Container } from "./styles";

const { TextArea } = Input;
const { Option } = SelectAnt;

export default function FormChild({
  op,
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
  setReload,
}: any) {
  const [selectedPatients] = useState([]);
  const [refreshAutoComplete] = useState(false);
  const [races, setRaces] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState<any>({});
  const [editPatientVisible, setEditPatientVisible] = useState(false);
  const [createPatientVisible, setCreatePatientVisible] = useState(false);

  const { createToast } = useToast();

  const { user } = useAuthAdmin();
  const { data: uniqueOrigins } = useLoadCampaings({
    active: true,
    clientOriginId: data?.originId,
  });

  const router = useRouter();
  const statusChangePermission = useUserHasPermission("CRM12");
  const editOpportunityPermission = useUserHasPermission("CRM02");

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
        createToast({
          message: "Houve um erro ao obter as raças disponíveis",
          status: "error",
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
      return createToast({
        message: "Informe a data do contado",
        status: "warning",
      });
    }
    if (!data?.statusId) {
      return createToast({ message: "Informe o status", status: "warning" });
    }
    if (!data?.userId) {
      return createToast({
        message: "Informe o responsável",
        status: "warning",
      });
    }
    return "ok";
  };

  const [showSpecie, setShowSpecie] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSpecie(true);
    }, 300);

    prvsValues && setData({ ...data, ...prvsValues });
  }, [prvsValues]);

  useEffect(() => {
    type === "create" &&
      setData({
        ...data,
        statusId: crmStatus.find((st) => st?.tag === "N")?.id,
      });
  }, [type, crmStatus]);

  const configurationSystem = useConfigurationsSystem()

  return (
    <Container
      onSubmit={async (e) => {
        e.preventDefault();

        verifyFields() === "ok" && (await submit());

        setEdit && setEdit(false);
      }}
    >
      <div className="body-form uk-padding-small">
        <div className="uk-flex uk-flex-between">
          <div className="uk-width-1-1 uk-margin-small-right">
            <FormCreateTutor
              isModal
              tutorId={data?.contact?.id || data.clientId}
              onSuccess={() => setReload((prv) => !prv)}
              origin="Crm"
              trigger={
                <label
                  className="uk-link"
                  style={{
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  Cliente
                </label>
              }
            />

            <Input value={data?.tutorName} disabled />
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
              <div
                className="uk-flex uk-flex-right uk-margin-remove"
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                {!edit && (
                  <>
                    {data?.closingDate === "-" &&
                      !data?.balance &&
                      editOpportunityPermission && (
                        <div>
                          <Button onClick={() => setEdit(true)} text="Editar" />
                        </div>
                      )}
                    <div>
                      <Button onClick={() => router.back()} text="Voltar" />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        {
          configurationSystem.type === "Vet" && (
          <div className="uk-flex uk-flex-between uk-margin-small-top">
            <div className="uk-width-1-4 uk-margin-small-right">
              <div className="uk-width-1-1">
                {type === "create" ? (
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    Pet
                  </label>
                ) : !!(
                    !data.patient?.id &&
                    !data.clientId &&
                    (data?.tutor_id || data?.contact?.id) &&
                    op?.id
                  ) ? (
                  <label
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    Pet
                    <FormCreateTutor
                      isModal
                      tutorId={
                        data?.contact?.id || data?.tutor_id || data.clientId
                      }
                      addPet={{
                        onInitOpenModalAddPet: true,
                        onLinkPet: async ({ patientId, handleSuccess }) => {
                          await handleSuccess();

                          await container
                            .get<RemoteCRM>(TypesAutomatiza.RemoteCRM)
                            .createOpportunitiePatient({
                              patientId,
                              opportunityId: op.id,
                            });

                          (await setReload) && setReload((prv) => !prv);
                        },
                      }}
                      onSuccess={() => setReload && setReload((prv) => !prv)}
                      origin="Crm"
                      trigger={
                        <button
                          type="button"
                          style={{
                            height: 20,
                            width: 20,
                            background: "#000",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +
                        </button>
                      }
                    />
                  </label>
                ) : (
                  <FormCreatePatient
                    isModal
                    origin="Crm"
                    patientId={data?.clientId}
                    initialDataForm={{
                      holders: [{ id: data?.contact?.tutor?.id, main: true }],
                    }}
                    trigger={<label className="uk-link">Pet</label>}
                  />
                )}

                <AutoComplete
                  disabled={true}
                  className="uk-width-1-1"
                  options={selectedPatients?.map((patient: any) => ({
                    ...patient,
                    value: patient?.name,
                    key: patient?.id,
                  }))}
                  value={data?.patientName}
                  onChange={(val) => setData({ ...data, patientName: val })}
                  onSelect={(_val, opt) => {
                    setData(state => ({
                      ...state,
                      clientId: opt?.id,
                      patientName: opt?.value,
                    }));
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
                <label>Espécie {">"} Raça do pet</label>

                {showSpecie && (
                  <FormHandler
                    disableEnterKeySubmitForm
                  >
                    <Select
                      name="species"
                      controlledInitialValue={{ value: data?.raceId }}
                      options={
                        races.map((race: any) => ({
                          label: race.value,
                          value: race.id,
                        })) || []
                      }
                      disabled={!footer ? !edit : false}
                      onlyOneValue
                      placeholder="Digite o nome da raça"
                      onChangeInput={(value) => {
                        if(value === data.raceId) {
                          return;
                        }

                        const choosed = races.find(
                          (option: any) => option.value === value
                        ) as any;

                        setData({
                          ...data,
                          raceId: choosed?.id,
                          raceDescription: choosed?.value,
                        });
                      }}
                    />
                  </FormHandler>
                )}
              </div>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <label>Genero</label>
              <SelectAnt
                disabled={!footer ? !edit : false}
                className="uk-width-1-1"
                id={"gender"}
                value={data?.gender}
                onChange={(e) => setData({ ...data, gender: e })}
              >
                <option value="macho">Macho</option>
                <option value="femea">Fêmea</option>
              </SelectAnt>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <label>Castrado</label>
              <SelectAnt
                disabled={!footer ? !edit : false}
                className="uk-width-1-1"
                value={data?.castrated}
                onChange={(val) => setData({ ...data, castrated: val })}
              >
                <Option value={true}>Sim</Option>
                <Option value={false}>Não</Option>
              </SelectAnt>
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
              value={data?.collabName || user?.firstName}
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
            {statusChangePermission ? (
              <SelectAnt
                disabled={
                  !op?.status?.syncSchedules ? (!footer ? !edit : true) : true
                }
                className="uk-width-1-1"
                value={data?.statusId}
                onChange={(val) => setData({ ...data, statusId: val })}
              >
                {crmStatus.length > 0 &&
                  crmStatus?.map((status) => (
                    <Option value={status?.id}>{status?.description}</Option>
                  ))}
              </SelectAnt>
            ) : (
              <SelectAnt
                disabled={true}
                className="uk-width-1-1"
                value={data?.statusId}
              >
                {crmStatus.length > 0 &&
                  crmStatus?.map((status) => (
                    <Option value={status?.id}>{status?.description}</Option>
                  ))}
              </SelectAnt>
            )}
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
              <FormHandler>
                <Select
                  menuPlacement="bottom"
                  name="contact"
                  disabled={!footer ? !edit : false}
                  options={contactTypes.map((ctt) => ({
                    label: ctt?.description,
                    value: ctt?.id,
                  }))}
                  onlyOneValue
                  onChangeInput={(val) =>
                    setData({ ...data, contactTypeId: val })
                  }
                  value={data?.contactTypeId}
                />
              </FormHandler>
            </div>
            <div className="uk-width-1-4 uk-margin-small-right">
              <div className="uk-margin-small">
                <label>Como conheceu a clinica</label>
                <FormHandler>
                  <Select
                    disabled={!footer ? !edit : false}
                    menuPlacement="bottom"
                    name="originId"
                    options={clients.map((client) => ({
                      label: client?.description,
                      value: client?.id,
                    }))}
                    onlyOneValue
                    onChangeInput={(val) => {
                      setData({ ...data, originId: val });
                    }}
                    value={data?.originId}
                  />
                </FormHandler>
              </div>
            </div>
            {(selectedOrigin?.default || uniqueOrigins?.length) > 0 && (
              <SelectMidia
                disabled={!footer ? !edit : false}
                data={data}
                setData={setData}
                options={uniqueOrigins}
              />
            )}
            <div className="uk-width-1-4">
              <label>Assunto Contato</label>
              <FormHandler>
                <Select
                  disabled={!footer ? !edit : false}
                  menuPlacement="bottom"
                  name="contactSubjectId"
                  options={subjects.map((subject) => ({
                    label: subject.description,
                    value: subject.id,
                  }))}
                  onlyOneValue
                  onChangeInput={(val) =>
                    setData({ ...data, contactSubjectId: val })
                  }
                  value={data?.contactSubjectId}
                />
              </FormHandler>
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
            <footer
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" text="Salvar" />

              <Button
                text="Cancelar"
                onClick={() => () => router.push("/crm/kanban")}
              />
            </footer>
          ) : (
            <>
              <hr />
              <footer
                className="uk-flex uk-flex-right"
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <Button type="submit" text="Salvar" />

                <Button
                    onClick={() => () => router.push("/crm/kanban")}
                  text="Cancelar"
                />
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
