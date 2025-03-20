import React, { useState, useEffect } from "react";

import moment from "moment";
import { AxiosError } from "axios";
import { PageWrapper, useAuthAdmin, useToast } from "infinity-forge";

import { useMe, useConfigurationsSystem } from "@/presentation";
import { useRouter } from "next/navigation";
import { useAuth } from "@/OLD/hooks/useAuth";
import { useProfile } from "@/OLD/hooks/useProfile";
import { opportunitiesService } from "@/OLD/services/opportunities.service";

import FormChild from "../../FormChild";
import { Container } from "../../styles";
import { Modal } from "antd";
import { Patient } from "@/OLD/components/Patient";
import { Tutor } from "@/OLD/components/Tutor";

import { currencyFormatter } from "@/OLD/components/Budget";
import { convertIntlCurrency } from "@/OLD/utils/convertIntl";

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

  const { user } = useAuthAdmin();
  const { clinic } = useProfile();
  const { crmData, setCrmData } = useAuth();

  const { createToast } = useToast();

  const router = useRouter();

  const {type} = useConfigurationsSystem()

  async function createOpportunity() {
    const newObj = {
      ...data,
      castrated: data?.castrated ? JSON.parse(data?.castrated) : "false",
      businessUnitId: clinic?.id,
      contactDate: moment(data?.contactDate).toISOString(),
      value: convertIntlCurrency(data?.value),
      clientId: type === "Vet" ?  data?.patient_id : undefined
    };

    if (newObj.clientId === "-") {
      delete newObj.clientId;
      delete newObj.castrated;
    }

    try {
      await opportunitiesService.create(newObj);

      createToast({
        status: "success",
        message: "Oportunidade cadastrada com sucesso!",
      });

      router.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        return createToast({
          status: "error",
          message: error?.response?.data?.title,
        });
      }

      return createToast({
        status: "error",
        message: "Verifique os campos informados...",
      });
    }
  }

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

  console.log(data)

  //ClientId está errado e deve averiguar o campo patient_id e colocar no ClientId o patient_id

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

        {user?.type === "Vet" && (
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
        {user?.type !== "Vet" && (
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
