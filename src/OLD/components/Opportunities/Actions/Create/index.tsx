// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/router";
import { useAuth } from "@/OLD/hooks/useAuth";

import FormChild from "../../FormChild";
import { Container } from "../../styles";
import { notification, Modal } from "antd";
import { Patient } from "@/OLD/components/Patient";
import { Tutor } from "@/OLD/components/Tutor";
import { PageWrapper } from "infinity-forge";

import { opportunitiesService } from "@/OLD/services/opportunities.service";

import { useProfile } from "@/OLD/hooks/useProfile";

import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

import moment from "moment";
import { currencyFormatter } from "@/OLD/components/Budget";

export default function Create({
  clients,
  colaborators,
  crmStatus,
  contactTypes,
  subjects,
}) {
  const [data, setData] = useState<any>({});
  const [patientListVisible, setPatientListVisible] = useState(true);
  const [reload, setReload] = useState(false);

  const { clinic, user } = useProfile();
  const { crmData, setCrmData } = useAuth();

  const router = useRouter();

  const createOpportunity = useCallback(() => {
    const newObj = {
      ...data,
      businessUnitId: clinic?.id,
      contactDate: moment(data?.contactDate).toISOString(),
      value: convertIntlCurrency(data?.value),
    };

    if (newObj.clientId === "-") {
      delete newObj.clientId;
      delete newObj.castrated;
    }

    opportunitiesService
      .create(newObj)
      .then((_res) => {
        router.back();
        return notification.success({
          message: "Oportunidade cadastrada com sucesso!",
        });
      })
      .catch((_err) => {
        return notification.error({
          message: "Verifique os campos informados...",
        });
      });
  }, [data, clinic]);

  useEffect(() => {
    setData({
      ...data,
      contactDate: moment(new Date()),
      value: currencyFormatter(0),
      userId: user?.id,
      collabName: user?.name,
      statusId: crmStatus?.find((st) => st?.tag === "N")?.id,
    });
  }, [user, crmStatus]);

  useEffect(() => {
    if (crmData) {
      setData(crmData);
      setCrmData(false);
      setPatientListVisible(false);
    }
  }, []);

  useEffect(() => {
    setReload((prv) => !prv);
  }, [patientListVisible]);

  return (
    <PageWrapper title="Nova oportunidade">
      <Container>
        <hr />
        {!patientListVisible && (
          <FormChild
            data={data}
            setData={setData}
            submit={createOpportunity}
            reload={reload}
            clients={clients}
            colaborators={colaborators}
            crmStatus={crmStatus}
            contactTypes={contactTypes}
            subjects={subjects}
          />
        )}

        {process.env.client === "sancla" && (
          <Modal
            title={"Selecionar paciente"}
            width={1200}
            visible={patientListVisible}
            onCancel={() => setPatientListVisible(false)}
            footer={null}
          >
            <Patient
              setPayload={setData}
              payload={data}
              modal={true}
              setVisible={setPatientListVisible}
              setSearch={setData}
              patientListVisible={patientListVisible}
              setReload={setReload}
              origin="opportunities"
            />
          </Modal>
        )}
        {process.env.client === "liftone" && (
          <Modal
            title={"Selecionar Cliente"}
            width={1200}
            visible={patientListVisible}
            onCancel={() => setPatientListVisible(false)}
            footer={null}
          >
            <Tutor
              setPayload={setData}
              payload={data}
              modal={true}
              setVisible={setPatientListVisible}
              setSearch={setData}
              patientListVisible={patientListVisible}
              setReload={setReload}
              reload={reload}
              origin="opportunities"
            />
          </Modal>
        )}
      </Container>
    </PageWrapper>
  );
}
