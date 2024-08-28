import { useState } from "react";
import {
  Button,
  Error,
  Modal,
  Select,
  FormHandler,
  LoaderCircle,
} from "infinity-forge";

import { useLoadSchedulesPatients } from "@/presentation/hooks";

import * as S from "./styles";

export function BondPet({ tutor, setPatients }) {
  const [modal, setModal] = useState(false);
  const { data, isLoading } = useLoadSchedulesPatients({});

  async function handleSubmit(payload) {
    const currentPatient = data?.find((patient) => patient.id === payload.pet);
    setPatients((prev) => [...prev, currentPatient]);
    setModal(false);
  }

  if (isLoading) {
    return <LoaderCircle size={30} color="#444" />;
  }

  return (
    <Error name="BondPet">
      <S.BondPet>
        <Button
          className="font-16-regular"
          text="Vincular pet"
          onClick={() => setModal(true)}
        />

        <Modal
          onClose={() => setModal(false)}
          open={modal}
          styles={{ width: "40rem", padding: 20, borderRadius: 10 }}
        >
          <S.BondPet>
            <h3 className="title">Vincular pet - Tutor: {tutor?.name}</h3>
            {data && (
              <FormHandler
                onSucess={handleSubmit}
                button={{ text: "Vincular" }}
              >
                <Select
                  onlyOneValue
                  name="pet"
                  label="Selecionar pet"
                  options={data?.map((pet) => ({
                    label: pet?.name,
                    value: pet?.id,
                  }))}
                />
              </FormHandler>
            )}
          </S.BondPet>
        </Modal>
      </S.BondPet>
    </Error>
  );
}
