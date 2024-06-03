// @ts-nocheck
import { memo, useCallback, useState } from "react";
import { AutoComplete, Button, Form, Modal, notification } from "antd";
import { Button as ButtonC } from "@/OLD/components/mini-components";
import { NewPatient } from "./NewPatient";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { petsService } from "@/OLD/services/patient.service";
import { useRouter } from "next/router";
import { Container } from "./styles";

export function AddPatient({ tutorId, setReload, setCreatePetVisible }) {
  const id = useRouter()?.query?.innerpage;

  const [payload, setPayload] = useState({ holder: id || tutorId });
  const [isVisible, setIsVisible] = useState(false);
  const [newPatientVisible, setNewPatientVisible] = useState(false);

  const { Option } = AutoComplete;

  const router = useRouter();

  const { data, loading } = useQuery("getPatients", petsService.getPatients, {
    onError: (error) => {
      notification.error({
        message: "Erro",
        description: "Erro ao buscar pacientes",
      });
    },
    staleTime: 20000,
    refetchInterval: 25000,
  });

  const { isLoading: isMutating, mutate } = useMutation(
    (payload) => petsService.assignPatientToTutor(payload),
    {
      onError: (error) => {
        notification.error({
          message: "Erro",
          description: "Não foi possível realizar o vinculo",
        });
      },
      onSuccess: () => {
        setReload((prv) => !prv);
        notification.success({
          message: "Sucesso",
          description: "Vinculo de paciente e tutor realizado",
        });
        setIsVisible(false);
      },
    }
  );

  const handleSubmit = useCallback(() => {
    document.getElementById("vinculate-subimit").click();
  }, []);

  return (
    <Container>
      <ButtonC
        classCallback="uk-margin-small-right"
        onClick={() => setCreatePetVisible(true)}
      >
        Adicionar pet
      </ButtonC>
      <ButtonC onClick={() => setIsVisible(true)}>Vincular pet</ButtonC>
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
                    {patient.name}
                  </Option>
                );
              })}
              <Option value="Criar novo paciente +">
                <Button
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  onClick={() => setNewPatientVisible(true)}
                >
                  Criar novo paciente +
                </Button>
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
