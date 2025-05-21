import { useState } from "react";

import {
  Button,
  Modal,
  Select,
  useToast,
  InputSwitch,
  InputControl,
} from "infinity-forge";
import { useField, useFormikContext } from "formik";

import { Tutor } from "@/domain";
import { FormCreateTutor, useLoadAllPatientTutor } from "@/presentation";

import * as S from "./styles";

export function Tutors({ origin }: { origin: "Cadastro" | "Crm" | "Agenda" }) {
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [modalAddTutor, setModalAddTutor] = useState(false);
   const { data, mutate } = useLoadAllPatientTutor({ enabled: modalAddTutor, modal, patientFilters: { name: "" } });

  const { values, setFieldValue } = useFormikContext<{
    holders: { id: string; main: boolean }[];
  }>();

  const [tutorField] = useField("holderId");

 const options = data?.map((tutor) => {
    return { label: `${tutor.name} // ${tutor.cellphone}`, value: tutor.id };
   });

   console.log(options)

  const holders = values["holders"] || [];

  const { createToast } = useToast();

  const handleSwitchChange = (index: number) => {
    const newHolders = holders.map((holder, i) => ({
      ...holder,
      main: i === index,
    }));
    setFieldValue("holders", newHolders);
  };

  const isRequired = origin === "Cadastro" || origin === "Agenda";

  return (
    <InputControl name="holders">
      <S.Tutors>
        <h4 className="font-18-bold">Tutores{isRequired ? "*" : ""}</h4>

        {holders?.map((holder, index) => {
          return (
            <div key={holder.id} className="tutor-item">
              <p className="font-16-bold">
                {data?.find((tutor) => tutor.id === holder.id)?.name}
              </p> 

              <InputSwitch
                name={`holders[${index}].main`}
                label="Ativo"
                checked={holder.main}
                onChangeInput={() => handleSwitchChange(index)}
              />
            </div>
          );
        })}

        <button
          type="button"
          className="add_tutor"
          onClick={() => setModalAddTutor(true)}
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

          <span className="font-16-regular">Adicionar tutor</span>
        </button>

        <Modal
          open={modalAddTutor}
          onClose={() => setModalAddTutor(false)}
          styles={{ maxWidth: "800px", paddingBottom: 20, width: "100%" }}
          stylesContent={{ overflow: "unset" }}
        >
          <S.ModalAddTutor>
            <h3 className="font-20-bold">Adicionar tutor</h3>
            {/* <Select
              name="holderId"
              label="Tutor"
              menuPlacement="top"
              placeholder="Selecionar tutor"
              options={options || []}
              onlyOneValue
            />  */}

            {error && (
              <span className="font-14" style={{ color: "red" }}>
                {error}
              </span>
            )}

            <div className="form-button sticky">
              <Button
                text="Vincular Tutor"
                onClick={() => {
                  if (!tutorField?.value) {
                    setError("Selecione um tutor.");
                    return;
                  }
                  setError("");
                  const value = values["holderId"];

                  if (holders.find((holder) => holder.id === value)) {
                    createToast({
                      status: "error",
                      message: "Tutor já adicionado",
                    });
                  } else {
                    setFieldValue("holders", [
                      ...holders,
                      {
                        id: value,
                        main: holders?.find((holder) => holder.main)
                          ? false
                          : true,
                      },
                    ]);

                    setFieldValue("holderId", "");

                    setModalAddTutor(false);
                  }
                }}
              />

              <Button text="Novo Tutor" onClick={() => setModal(true)} />
            </div>
          </S.ModalAddTutor>
        </Modal>

        <Modal open={modal} onClose={() => setModal(false)}>
          <FormCreateTutor
            origin={origin}
            isModal={false}
            onSuccess={async (data: Tutor) => {
              await mutate();

              setTimeout(() => {
                setFieldValue("holderId", data.id);

                setModal(false);
              }, 500);
            }}
          />
        </Modal>
      </S.Tutors>
    </InputControl>
  );
}
