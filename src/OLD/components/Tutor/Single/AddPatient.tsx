// @ts-nocheck
import { memo, useCallback, useState } from "react";
import { AutoComplete, Form, Modal } from "antd";
import { NewPatient } from "./NewPatient";
import { useQuery, useQueryClient, useMutation } from "infinity-forge";
import { petsService } from "@/OLD/services/patient.service";
import { useRouter } from "next/router";
import { Container } from "./styles";
import { Button, useToast } from "infinity-forge";

export function AddPatient({ tutorId, setReload, setCreatePetVisible }) {
  const id = useRouter()?.query?.innerpage;

  const [payload, setPayload] = useState({ holder: id || tutorId });
  const [isVisible, setIsVisible] = useState(false);
  const [newPatientVisible, setNewPatientVisible] = useState(false);

  const { Option } = AutoComplete;

  const router = useRouter();

  const { createToast } = useToast();

  const { data, loading } = useQuery({
    queryKey: "getPatients",
    queryFn: petsService.getPatients,
    onError: (error) => {
      createToast({ status: "error", message: "Erro ao buscar pacientes" });
    },
  });

  const { isLoading: isMutating, mutate } = useMutation({
    queryKey: ["addPatient"],
    queryFn: (payload) => petsService.assignPatientToTutor(payload),
    onError: (error) => {
      createToast({
        status: "error",
        message: "Não foi possível realizar o vinculo",
      });
    },
    onSuccess: () => {
      setReload((prv) => !prv);

      createToast({
        status: "success",
        message: "Vinculo de paciente e tutor realizado",
      });

      setIsVisible(false);
    },
  });

  const handleSubmit = useCallback(() => {
    document.getElementById("vinculate-subimit").click();
  }, []);

  return (
    <Container>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Button
          classCallback="uk-margin-small-right"
          onClick={() => setCreatePetVisible(true)}
          text="Adicionar pet"
        />

        <Button onClick={() => setIsVisible(true)} text="Vincular pet" />
      </div>
      <Modal
        visible={isVisible}
        onCancel={() => setIsVisible(false)}
        onOk={handleSubmit}
        title="Vincular paciente"
      >
        <Form
          layout="vertical"
          onSubmitCapture={() => mutate(payload)}
          loading={isMutating}
        >
          <Form.Item label="Paciente" className="uk-width-1-1">
            <AutoComplete
              required
              loading={loading}
              onChange={(e) => {
                const choosed = data?.find((patient) => patient.name === e);
                setPayload({ ...payload, patient: choosed?.id });
              }}
              placeholder="Digite o nome do paciente"
              filterOption={(inputValue, patient) =>
                patient.value
                  .toUpperCase()
                  .indexOf(inputValue.toUpperCase()) !== -1
              }
            >
              {data?.map((patient, key) => {
                return (
                  <Option key={key} value={patient.name}>
                    {patient?.name} - RG:{patient?.tag} - Raça:
                    {patient?.race?.specie?.description} {">"}{" "}
                    {patient?.race?.description}`,
                  </Option>
                );
              })}
              <Option value="Criar novo paciente +">
                <Button
                  onClick={() => setNewPatientVisible(true)}
                  text="Criar novo paciente +"
                />
              </Option>
            </AutoComplete>
          </Form.Item>
          <input
            type="submit"
            id="vinculate-subimit"
            style={{ display: "none" }}
          />
        </Form>
      </Modal>
      <NewPatient
        isVisible={newPatientVisible}
        close={() => setNewPatientVisible(false)}
      />
    </Container>
  );
}
