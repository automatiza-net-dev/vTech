import { useState } from "react";

import { useRouter } from "next/router";

import moment from "moment";
import {
  Error,
  Input,
  Modal,
  Select,
  Textarea,
  FormHandler,
  useToast,
} from "infinity-forge";

import {
  useLoadBeds,
  PermissionItem,
  useLoadPatient,
  useLoadAllBusinessUsers,
  useConfigurationsSystem,
} from "@/presentation";
import { RemotePatient } from "@/data";
import { TypesAutomatiza, container } from "@/container";

import * as S from "./styles";

export function Hospitalization() {
  const [modal, setModal] = useState(false);

  const { createToast } = useToast();

  const router = useRouter();

  const {type} = useConfigurationsSystem();

  const beds = useLoadBeds();
  const patient = useLoadPatient();
  const businessUsers = useLoadAllBusinessUsers();

  if (type !== "Vet") {
    return <></>;
  }

  return (
    <Error name="Hospitalization">
      <PermissionItem hash="FIC04">
        <Modal
          onClose={() => setModal(false)}
          open={modal}
          styles={{ maxWidth: "800px", width: "100%" }}

          // title={`Internação - Admissão, Paciente: ${patient.data?.name}, Rg: ${
          //   patient.data?.tag ?? "-"
          // }`}
        >
          <S.HospitalizationContent>
            <FormHandler
              isStickyButtons
              button={{ text: "SALVAR" }}
              cleanFieldsOnSubmit={false}
              onSucess={async (data) => {
                await container
                  .get<RemotePatient>(TypesAutomatiza.RemotePatient)
                  .createHospitalization({
                    ...data,
                    patientId: patient.data?.id,
                    tutorId: patient.data?.tutor.id,
                  });

                createToast({
                  message: "Hospitalização criada com sucesso!",
                  status: "success",
                });

                router.push("/dashboard/internacao");
              }}
            >
              <div className="row">
                <Select
                  onlyOneValue
                  name="type"
                  options={[
                    {
                      label: "Admissão de Internação",
                      value: "1",
                    },
                    {
                      label: "Admissão de Observação",
                      value: "2",
                    },
                    {
                      label: "Admissão de Uti",
                      value: "3",
                    },
                  ]}
                  label="Situação"
                />

                <Select
                  name="risk"
                  onlyOneValue
                  options={[
                    {
                      label: "Leve",
                      value: "1",
                    },
                    {
                      label: "Médio",
                      value: "2",
                    },
                    {
                      label: "Grave",
                      value: "3",
                    },
                    {
                      label: "Grávissimo",
                      value: "4",
                    },
                  ]}
                  label="Grau de risco"
                />
              </div>

              <Select
                name="bedId"
                onlyOneValue
                options={
                  beds.data?.map((bed) => ({
                    label: bed.name,
                    value: bed.id,
                  })) || []
                }
                label="Leito de internação"
                loading={beds.isFetching}
              />

              <div className="row">
                <Select
                  name="tutor"
                  onlyOneValue
                  options={
                    businessUsers?.data?.map((businessUser) => ({
                      label: businessUser.name,
                      value: businessUser.id,
                    })) || []
                  }
                  label="Veterinário"
                  readOnly
                  loading={businessUsers.isFetching}
                />
                <Input
                  name="expectedDischarge"
                  type="date"
                  min={moment().format("YYYY-MM-DD")}
                  label="Data previsão de alta"
                />
              </div>

              <Textarea name="complaint" label="Queixa" />

              <Textarea name="diagnosis" label="Diagnóstico" />

              <Textarea name="prognosis" label="Prognóstico" />
            </FormHandler>
          </S.HospitalizationContent>
        </Modal>

        <S.Hospitalization
          svg="IconHospitalization"
          text="INTERNAÇÃO"
          onClick={() => {
            patient.data?.isHospitalized
              ? router.push("/dashboard/internacao")
              : setModal(true);
          }}
        />
      </PermissionItem>
    </Error>
  );
}
