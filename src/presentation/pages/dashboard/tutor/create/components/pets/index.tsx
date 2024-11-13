import { useState } from "react";

import { useField, useFormikContext } from "formik";
import { Button, InputControl, Modal, Select, useToast } from "infinity-forge";

import {
  ClientPermission,
  FormCreatePatient,
  useLoadSchedulesPatients,
} from "@/presentation";
import { Patient, Tutor } from "@/domain";

import { ICreateTutorFormProps } from "../form/interfaces";

import * as S from "./styles";

export function Pets({
  tutor,
  addPet,
  handleSuccess,
}: {
  tutor?: Tutor;
  handleSuccess?(data: any): Promise<void>;
} & ICreateTutorFormProps) {
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [modalAddPet, setModalAddPet] = useState(
    addPet?.onInitOpenModalAddPet ? true : false
  );

  const patientFilters = {
    fetch: true,
  };

  const { createToast } = useToast();
  const { values, setFieldValue } = useFormikContext<Tutor>();
  const { data, isLoading, mutate } = useLoadSchedulesPatients({
    patientFilters,
  });

  const options = data?.map((tutor) => {
    return { label: tutor.name, value: tutor.id };
  });

  const [petId] = useField("petId");
  const pets = values["patients"] || [];

  return (
    <ClientPermission client="sancla">
      <InputControl name="holders">
        <S.Pets>
          {values.patients && values.patients.length > 0 && (
            <h4 className="font-18-bold">Pets</h4>
          )}

          {values?.patients?.map((pet: any) => {
            return (
              <div key={pet.id} className="item">
                <p className="font-16-bold">{pet.name}</p>
              </div>
            );
          })}

          <button
            onClick={() => setModalAddPet(true)}
            type="button"
            className="add"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="30" height="30" rx="5" fill="#E1E1E1" />
              <path
                d="M14.25 14.25V11.25H15.75V14.25H18.75V15.75H15.75V18.75H14.25V15.75H11.25V14.25H14.25ZM15 22.5C10.8579 22.5 7.5 19.1421 7.5 15C7.5 10.8579 10.8579 7.5 15 7.5C19.1421 7.5 22.5 10.8579 22.5 15C22.5 19.1421 19.1421 22.5 15 22.5ZM15 21C18.3137 21 21 18.3137 21 15C21 11.6863 18.3137 9 15 9C11.6863 9 9 11.6863 9 15C9 18.3137 11.6863 21 15 21Z"
                fill="#828282"
              />
            </svg>

            <span className="font-16-regular">Adicionar pet</span>
          </button>

          <Modal
            open={modalAddPet}
            onClose={() => setModalAddPet(false)}
            styles={{ maxWidth: "800px", paddingBottom: 20, width: "100%" }}
            stylesContent={{ overflow: "unset" }}
          >
            <S.ModalAddPets>
              <h3 className="font-20-bold">Adicionar Pet</h3>
              <Select
                name="petId"
                label="Pet"
                menuPlacement="top"
                placeholder="Selecionar pet"
                options={options || []}
                onlyOneValue
                loading={isLoading}
              />

              {error && (
                <span className="font-14" style={{ color: "red" }}>
                  {error}
                </span>
              )}

              <div className="form-button sticky">
                <Button
                  type="button"
                  text="Vincular Pet"
                  onClick={async () => {
                    if (!petId?.value) {
                      setError("Selecione um Pet.");
                      return;
                    }
                    setError("");
                    const value = values["petId"];

                    if (pets.find((pet) => pet.id === value)) {
                      createToast({
                        status: "error",
                        message: "Pet já adicionado",
                      });
                      return;
                    }

                    handleSuccess &&
                      setFieldValue("patients", [
                        ...pets,
                        {
                          id: value,
                          name: data?.find((pet) => pet.id === value)?.name,
                        },
                      ]);

                    setFieldValue("petId", "");

                    addPet?.onLinkPet &&
                      (await addPet.onLinkPet({
                        patientId: value,
                        handleSuccess: async () => {
                          if (handleSuccess)
                            await handleSuccess({
                              ...values,
                              petId: undefined,
                              patients: [
                                ...pets,
                                {
                                  id: value,
                                  name: data?.find((pet) => pet.id === value)
                                    ?.name,
                                },
                              ],
                            });
                        },
                      }));

                    setModalAddPet(false);
                  }}
                />

                <Button text="Novo Pet" onClick={() => setModal(true)} />
              </div>
            </S.ModalAddPets>
          </Modal>

          <Modal open={modal} onClose={() => setModal(false)}>
            <FormCreatePatient
              isModal={false}
              onSuccess={async (data: Patient) => {
                await mutate();

                setTimeout(() => {
                  setFieldValue("petId", data.id);

                  setModal(false);
                }, 500);
              }}
            />
          </Modal>
        </S.Pets>
      </InputControl>
    </ClientPermission>
  );
}
