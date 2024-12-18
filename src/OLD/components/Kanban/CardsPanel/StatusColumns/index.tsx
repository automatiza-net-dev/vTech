// @ts-nocheck
import { memo, useState, useEffect } from "react";

import { useRouter } from "next/router";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";
import { useSchedule } from "@/OLD/hooks/useSchedules";

import { Container } from "./styles";
import OpActivities from "@/OLD/components/OpportunitiesActivities";
import CreateActivity from "@/OLD/components/OpportunitiesActivities/Create";
import UpdateActivity from "@/OLD/components/OpportunitiesActivities/Update";
import FormControll from "../FormControll";
import { Tooltip, Menu, Dropdown, Button } from "antd";
import { Modal } from "infinity-forge";
import SyncOpportunity from "../SyncOpportunity";

import { SideBarContent } from "@/presentation";
import { SideBar } from "infinity-forge";

import { PlusOutline } from "styled-icons/evaicons-outline";
import { BsFillClockFill } from "react-icons/bs";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";
import { caracterLimit } from "@/OLD/utils/generalUtils";

const detectClockColor = (date, duration) => {
  if (moment(date) > moment()) {
    return "blue";
  }

  if (
    moment(date) < moment() &&
    moment(date).add(duration, "minutes") > moment()
  ) {
    return "yellow";
  }

  return "red";
};

const menu = (setFormData, op, permissions) => {
  return (
    <Menu
      items={[
        {
          key: "1",
          onClick: () => {
            setFormData({ form: "newActivity", op });
          },
          label: "Adicionar atividadeeee",
        },
        permissions?.addGainPermission && {
          key: "2",
          onClick: () =>
            setFormData({
              op,
              form: "gain",
              title: "Ganho oportunidade",
              currencyField: "Valor do ganho (R$)",
              selectField: "Motivo Ganho",
              areaField: "Observações",
            }),
          label: "Informar ganho",
        },
        permissions?.addLossPermission && {
          key: "3",
          onClick: () =>
            setFormData({
              op,
              form: "loss",
              title: "Perda Oportunidade",
              selectField: "Motivo Perda",
              areaField: "Observações",
            }),
          label: "informar perda",
        },
        permissions?.changeStatusAndTechnicianPermission && {
          key: "4",
          onClick: () =>
            setFormData({
              op,
              form: "changeStatus",
              title: "Troca de status da oportunidade",
              actualField: "Status atual",
              actualValue: op?.status?.description,
              selectField: "Novo status",
            }),
          label: "Alterar status",
        },
        permissions?.changeStatusAndTechnicianPermission && {
          key: "5",
          onClick: () =>
            setFormData({
              op,
              form: "changeTechnician",
              title: "Troca responsável oportunidade",
              actualField: "Responsável Atual",
              completeField: "Novo responsável",
              actualValue: op?.user?.name,
            }),
          label: "Alterar responsável",
        },
      ]}
    />
  );
};

function StatusColumns({
  column,
  opportunities,
  setReload,
  orderBy,
  subjects,
  colaborators,
  crmStatus,
  contactTypes,
  clients,
  actTypes,
  reload,
}) {
  const [opportunityVisible, setOpportunityVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(false);
  const [formData, setFormData] = useState(false);
  const [updateActVisible, setUpdateActVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(false);
  const [sortedOpportunities, setSortedOpportunities] = useState([]);
  const [syncOpportunityVisible, setSyncOpportunityVisible] = useState(false);
  const [scheduleDetailsVisible, setScheduleDetailsVisible] = useState(false);

  const { schedule } = useSchedule(scheduleDetailsVisible);

  const newOpportunityPermission = useUserHasPermission("CRM01");
  const changeStatusAndTechnicianPermission = useUserHasPermission("CRM02");
  const addGainPermission = useUserHasPermission("CRM04");
  const addLossPermission = useUserHasPermission("CRM05");
  const addActivityPermission = useUserHasPermission("CRM06");
  const viewActivitiesPermission = useUserHasPermission("CRM07");

  const router = useRouter();

  const sortOpportunities = () => {
    if (orderBy.includes("Date")) {
      return setSortedOpportunities(
        opportunities.sort((a, b) =>
          moment(b[orderBy]).diff(moment(a[orderBy]))
        )
      );
    } else {
      return setSortedOpportunities(
        opportunities?.sort((a, b) => {
          if (
            a[orderBy]?.name?.toLowerCase() < b[orderBy]?.name?.toLowerCase()
          ) {
            return -1;
          }

          if (
            a[orderBy]?.name?.toLowerCase() > b[orderBy]?.name?.toLowerCase()
          ) {
            return 1;
          }

          return 0;
        })
      );
    }
  };

  useEffect(() => {
    if (opportunities && orderBy) {
      return sortOpportunities();
    }

    setSortedOpportunities(opportunities);
  }, [orderBy, opportunities]);

  return (
    <Container className="uk-width-1-5">
      <div className="title-header uk-box-shadow-medium">
        <h6 className="uk-margin-remove">
          {column.label}
          {column?.title === "Nova Oportunidade" &&
            newOpportunityPermission && (
              <Tooltip title="Adicionar oportunidade">
                <PlusOutline
                  size={25}
                  className="custom-icon"
                  onClick={() => router.push("/crm/oportunidades/nova")}
                />
              </Tooltip>
            )}
        </h6>
        <div className="cards-qty">{sortedOpportunities?.length || 0}</div>
      </div>
      <div className="uk-margin-small-top">
        {sortedOpportunities?.map((op) => (
          <div className="cards-container uk-box-shadow-medium">
            <div>
              <div
                className="uk-width-1-1"
                onClick={() => {
                  setSelectedOpportunity(op);
                  setOpportunityVisible(true);
                }}
              >
                <strong>
                  {op?.contact?.name || ""}
                  {process.env.client !== "liftone" &&
                    `(${op?.client?.name || "pac. não vinculado"})`}
                </strong>
                <div className="uk-flex uk-flex-between uk-width-1-1">
                  <div>
                    Abertura: {moment(op?.openingDate).format("DD/MM/YYYY")}
                  </div>
                  &nbsp;
                  <div className="uk-margin-small-right">
                    Contato: {moment(op?.contactDate).format("DD/MM/YYYY")}
                  </div>
                </div>
                <div>Responsável: {op?.user?.name} </div>
                <div>
                  Título:{" "}
                  {op?.description && caracterLimit(op?.description, 30)}
                </div>
              </div>
              <div>
                {op?.schedule ? (
                  <span
                    onClick={() => {
                      setScheduleDetailsVisible(op?.schedule?.id);
                    }}
                    className="uk-link"
                  >{`Agendado: ${moment(
                    op?.schedule?.startHour,
                    "YYYY-MM-DD[T]HH:mm:ss"
                  ).format("DD/MM/YYYY - HH:mm")}`}</span>
                ) : (
                  <span
                    className="uk-link"
                    onClick={() => {
                      setSelectedOpportunity(op);
                      setSyncOpportunityVisible(true);
                    }}
                  >
                    Vincular agenda
                  </span>
                )}
              </div>
            </div>
            {/*</Tooltip>*/}
            <div>
              <div>
                <Dropdown
                  trigger="click"
                  placement="bottom"
                  overlay={menu(setFormData, op, {
                    addActivityPermission,
                    addGainPermission:
                      addGainPermission && op?.status?.ganho ? true : false,
                    addLossPermission:
                      addLossPermission && op?.status?.perda ? true : false,
                    changeStatusAndTechnicianPermission,
                  })}
                >
                  <PlusOutline size={15} />
                </Dropdown>
              </div>

              {op?.activities?.length > 0 &&
                viewActivitiesPermission &&
                op?.activities
                  ?.sort((a, b) =>
                    moment(a.executionDate).diff(moment(b.executionDate))
                  )
                  .map((act, i) => {
                    if (i < 4) {
                      return (
                        <div>
                          <Tooltip
                            title={
                              <div>
                                <div>Prof. Responsável: {act?.user?.name} </div>
                                <div>
                                  Atividade: {act?.activity?.description}
                                </div>
                                <div>
                                  Data / Hora agendada:{" "}
                                  {moment(act?.executionDate).format(
                                    "DD/MM/YYYY - HH:mm"
                                  )}
                                </div>
                                <div>Duração: {act?.activity?.duration}</div>
                                <div>Anotações: {act?.description}</div>
                              </div>
                            }
                          >
                            <BsFillClockFill
                              color={detectClockColor(
                                act?.executionDate,
                                act?.duration
                              )}
                              onClick={() => {
                                setSelectedOpportunity(op);
                                setSelectedActivity(act);
                                setUpdateActVisible(true);
                              }}
                            />
                          </Tooltip>
                        </div>
                      );
                    }
                  })}
            </div>
          </div>
        ))}
      </div>
      <Modal
        open={opportunityVisible}
        styles={{ width: "1000px", padding: "20px" }}
        onClose={() => {
          setOpportunityVisible(false);
          setSelectedOpportunity(false);
        }}
        children={
          <>
            <OpActivities
              clients={clients}
              colaborators={colaborators}
              crmStatus={crmStatus}
              contactTypes={contactTypes}
              subjects={subjects}
              origin={"kanban"}
              op={selectedOpportunity}
              refresh={() => setReload((prv) => !prv)}
              actTypes={actTypes}
            />
            <hr />
            <footer className="uk-flex uk-flex-right">
              <Button
                onClick={() => {
                  setOpportunityVisible(false);
                  setSelectedOpportunity(false);
                }}
              >
                Fechar
              </Button>
            </footer>
          </>
        }
      />

      {formData?.form === "newActivity" && (
        <>
          <CreateActivity
            visible={formData?.form === "newActivity"}
            setVisible={setFormData}
            setReload={setReload}
            opportunity={formData?.op}
            colaborators={colaborators}
            actTypes={actTypes}
          />
        </>
      )}
      {selectedActivity && (
        <>
          <UpdateActivity
            setReload={setReload}
            visible={updateActVisible}
            setVisible={setUpdateActVisible}
            activity={selectedActivity}
            origin={"kanban"}
            edit={true}
            op={selectedOpportunity}
            colaborators={colaborators}
            actTypes={actTypes}
          />
        </>
      )}
      {syncOpportunityVisible && (
        <Modal
          open={syncOpportunityVisible}
          onClose={() => setSyncOpportunityVisible(false)}
          styles={{ width: "700px", padding: "20px" }}
          children={
            <>
              {`Vincular agendamentos - ${
                selectedOpportunity?.client?.name ||
                selectedOpportunity?.contact?.name
              }`}
              <SyncOpportunity
                data={selectedOpportunity}
                setVisible={setSyncOpportunityVisible}
                setReload={setReload}
              />
            </>
          }
        />
      )}
      <FormControll
        formData={formData}
        setFormData={setFormData}
        setReload={setReload}
      />
      {schedule && (
        <div className="side-bar-section">
          <SideBar
            open={scheduleDetailsVisible}
            setOpen={setScheduleDetailsVisible}
            maxWidth="400px"
            overlay
          >
            <SideBarContent
              event={{ event: schedule }}
              timeText={`${moment(
                schedule?.start_hour,
                "YYYY-MM-DD[T]HH:mm:ss"
              ).format("HH:mm")} - ${moment(
                schedule?.end_hour,
                "YYYY-MM-DD[T]HH:mm:ss"
              ).format("HH:mm")}`}
              setOpen={setScheduleDetailsVisible}
              scheduleUser={null as any}
              viewCalendar={"day"}
              refetchKeyWeekCalendar={undefined}
            />
          </SideBar>
        </div>
      )}
    </Container>
  );
}

export default StatusColumns;
