// @ts-nocheck
import React, { memo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useShowOpportunity } from "@/OLD/hooks/useOpportunities";
import { useProfile } from "@/OLD/hooks/useProfile";
import { useUserHasPermission } from "@/OLD/hooks/useProfile";

import { Container } from "./styles";
import OpportunitiesForm from "@/OLD/components/Opportunities/FormChild";
import Actions from "./Actions";
import CreateActivity from "@/OLD/components/OpportunitiesActivities/Create";
import { Table, notification, Input } from "antd";
import { Button } from "infinity-forge";

import { opportunitiesActivitiesColumns } from "./Columns";
import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";
import moment from "moment";

const OpActivities = memo(function OpActivities({
  origin = "none",
  op = false,
  refresh = false,
  clients,
  colaborators,
  crmStatus,
  contactTypes,
  subjects,
  actTypes,
}) {
  const [opportunitiesData, setOpportunitiesData] = useState({});
  const [activities, setActivities] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createActVisible, setCreateActVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const router = useRouter();

  const newAcitivityPermission = useUserHasPermission("CRM06");

  const { opportunity } = useShowOpportunity(
    !op?.id ? router.query.innerpage : op?.id,
    reload
  );
  const { clinic } = useProfile();

  useEffect(() => {
    setOpportunitiesData({
      balance: opportunity?.balance,
      active: opportunity?.active,
      contactDate: moment(opportunity?.contactDate),
      description: opportunity?.description,
      collabName: opportunity?.user?.name,
      userId: opportunity?.user?.id,
      tutorName: opportunity?.contact?.name,
      clientId: opportunity?.client?.id,
      patientName: opportunity?.client?.name,
      contactId: opportunity?.contact?.id,
      statusId: opportunity?.status?.id,
      contactTypeId: opportunity?.contactType?.id,
      originId: opportunity?.clientOrigin?.id,
      contactSubjectId: opportunity?.contactSubject?.id,
      value: currencyFormatter(opportunity?.value),
      observation: opportunity?.observation,
      closingUser: opportunity?.closingUser?.name,
      contact: opportunity?.contact,
      closingDate: opportunity?.closingDate
        ? moment(opportunity?.closingDate).format("DD/MM/YYYY")
        : "-",
      value: currencyFormatter(opportunity?.value),
      gain: opportunity?.balance,
      observation: opportunity?.observation,
      schedule: opportunity?.schedule,
      weight: opportunity?.weight,
      raceId: opportunity?.race?.id,
      gender: opportunity?.gender,
      raceDescription: `${opportunity?.race?.specie?.description} > ${opportunity?.race?.description}`,
      castrated: JSON.stringify(opportunity?.castrated),
      patient: op?.client,
      contact: opportunity?.contact,
      weight: opportunity?.client?.weight,
      gender: opportunity?.client?.gender,
      originDescription: opportunity?.clientOrigin?.description,
      originId: opportunity?.clientOrigin?.id,
      clientOriginItemDescription: opportunity?.clientOriginItemDescription,
      marketingCampaignId: opportunity?.marketingCampaignId,
    });
  }, [opportunity, reload]);

  useEffect(() => {
    opportunity?.activities?.length > 0
      ? setActivities(
          opportunity?.activities
            ?.sort((a, b) =>
              moment(b.execution_date).diff(moment(a.execution_date))
            )
            .map((activity) => ({
              balance: opportunity?.balance,
              user: opportunity?.user?.name,
              activity: activity?.activity?.description,
              duration: activity.duration,
              description: activity?.description,
              status: activity?.status,
              marketingCampaignId: activity?.marketingCampaignId,
              executionDate: moment(activity?.execution_date).format(
                "DD/MM/YYYY - HH:mm"
              ),
              executedDate: activity?.executed_date
                ? moment(activity?.executed_date).format("DD/MM/YYYY - HH:mm")
                : "-",
              actions: (
                <Actions
                  activity={activity}
                  setReload={setReload}
                  op={op || opportunity}
                  colaborators={colaborators}
                  actTypes={actTypes}
                />
              ),
            }))
        )
      : setActivities([]);
  }, [opportunity, op, actTypes, colaborators]);

  const updateOpportunity = useCallback(() => {
    setLoading(true);

    const formattedData = {
      businessUnitId: clinic?.id,
      userId: opportunitiesData?.userId,
      contactId: opportunitiesData?.contactId,
      statusId: opportunitiesData?.statusId,
      description: opportunitiesData?.description,
      observation: opportunitiesData?.observation,
      value: convertIntlCurrency(opportunitiesData?.value),
      active: opportunitiesData?.active,
      contactTypeId: opportunitiesData?.contactTypeId,
      contactSubjectId: opportunitiesData?.contactSubjectId,
      clientId: opportunitiesData?.clientId,
      contactDate: moment(opportunitiesData?.contactDate).toISOString(),
      originId: opportunitiesData?.originId,
      weight: opportunitiesData?.weight,
      gender: opportunitiesData?.gender,
      castrated: opportunitiesData?.castrated,
      raceId: opportunitiesData?.raceId,
      marketingCampaignId: opportunitiesData?.marketingCampaignId,
      clientOriginItemDescription:
        opportunitiesData?.clientOriginItemDescription,
    };

    process.env.client === "liftone" && delete formattedData?.castrated;

    opportunitiesService
      .update(opportunity?.id, formattedData)
      .then((_res) => {
        setLoading(false);
        setReload((prv) => !prv);
        refresh && refresh();
        return notification.success({
          message: "Oportunidade atualizada com sucesso!",
        });
      })
      .catch((_err) => {
        setLoading(false);
        return notification.error({
          message:
            "Houve um erro ao atualizar as informações da oportunidade, verifique os campos informados",
        });
      });
  }, [
    JSON.stringify(opportunitiesData),
    clinic?.id,
    JSON.stringify(opportunity),
  ]);

  return (
    <Container className={`${origin === "none" && "uk-padding"} uk-width-1-1`}>
      <h3 className="uk-margin-remove">Atividades oportunidade</h3>
      <hr />
      <OpportunitiesForm
        op={op}
        clients={clients}
        colaborators={colaborators}
        crmStatus={crmStatus}
        contactTypes={contactTypes}
        subjects={subjects}
        data={opportunitiesData}
        setData={setOpportunitiesData}
        submit={updateOpportunity}
        edit={edit}
        setEdit={setEdit}
        type="update"
        footer={false}
        setReload={setReload}
      />
      {opportunitiesData?.balance !== null && (
        <div>
          <hr />
          {opportunitiesData?.balance === "Ganho" && (
            <section className="gain-section">
              <div>
                <span>Valor ganho</span>
                <Input disabled value={opportunity?.profitValue} />
              </div>
              <div>
                <span>Motivo ganho</span>
                <Input disabled value={opportunity?.reason?.reason} />
              </div>
              <div>
                <span>Observação ganho</span>
                <Input disabled value={opportunity?.resultObservation} />
              </div>
            </section>
          )}
          {opportunitiesData?.balance === "Perda" && (
            <section className="loss-section">
              <div>
                <span>Motivo Perda</span>
                <Input disabled value={opportunity?.reason?.reason} />
              </div>
              <div>
                <span> Observações Perda </span>
                <Input disabled value={opportunity?.resultObservation} />
              </div>
            </section>
          )}
        </div>
      )}
      <hr />
      <div className="uk-flex uk-flex-between">
        <h4 className="uk-margin-remove">Atividades</h4>
        {!edit &&
          opportunitiesData?.closingDate === "-" &&
          newAcitivityPermission && (
            <Button
              text="Nova atividade"
              onClick={() => setCreateActVisible(true)}
            />
          )}
      </div>
      <Table
        columns={opportunitiesActivitiesColumns}
        dataSource={activities}
        className="uk-margin-small-top"
      />
      <CreateActivity
        visible={createActVisible}
        setVisible={setCreateActVisible}
        setReload={setReload}
        opportunity={opportunity}
        colaborators={colaborators}
        actTypes={actTypes}
      />
    </Container>
  );
});

export default OpActivities;
