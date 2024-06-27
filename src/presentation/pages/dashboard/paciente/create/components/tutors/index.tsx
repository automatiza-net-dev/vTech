import { useState } from "react";

import { Button, InputControl, Modal, Select, useToast } from "infinity-forge";

import { FormCreateTutor, useLoadAllPatientTutor } from "@/presentation";
import { useFormikContext } from "formik";

import * as S from "./styles";
import { Tutor } from "@/domain";
import { useQueryClient } from "react-query";

export function Tutors() {
  const [modal, setModal] = useState(false);
  const [modalAddTutor, setModalAddTutor] = useState(false);

  const { data, refetch } = useLoadAllPatientTutor({});

  const { values, setFieldValue } = useFormikContext<{
    holders: { id: string; main: boolean }[];
  }>();

  const options = data?.map((tutor) => {
    return { label: tutor.name, value: tutor.id };
  });

  const holders = values["holders"] || [];

  const { createToast } = useToast();

  return (
    <InputControl name="holders">
      <S.Tutors>
        <h4 className="font-18-bold">Tutores</h4>

        {holders?.map((holder) => {
          return (
            <div key={holder.id} className="tutor-item">
              <p className="font-16-bold">
                {data?.find((tutor) => tutor.id === holder.id)?.name}
              </p>

              <button
                type="button"
                onClick={() =>
                  setFieldValue(
                    "holders",
                    holders.filter((tutor) => tutor.id !== holder.id)
                  )
                }
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
                    d="M18.3333 10.9999H21.6666V12.3333H20.3333V20.9999C20.3333 21.3681 20.0348 21.6666 19.6666 21.6666H10.3333C9.96513 21.6666 9.66665 21.3681 9.66665 20.9999V12.3333H8.33331V10.9999H11.6666V8.99992C11.6666 8.63173 11.9651 8.33325 12.3333 8.33325H17.6666C18.0348 8.33325 18.3333 8.63173 18.3333 8.99992V10.9999ZM19 12.3333H11V20.3333H19V12.3333ZM13 14.3333H14.3333V18.3333H13V14.3333ZM15.6666 14.3333H17V18.3333H15.6666V14.3333ZM13 9.66659V10.9999H17V9.66659H13Z"
                    fill="#828282"
                  />
                </svg>
              </button>
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
            <Select
              name="holderId"
              label="Tutor"
              menuPlacement="top"
              placeholder="Selecionar tutor"
              options={options || []}
              addButton={{ onClick: () => setModal(true) }}
              onlyOneValue
            />

            <div className="form-button sticky">
              <Button
                text="Adicionar"
                onClick={() => {
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
            </div>
          </S.ModalAddTutor>
        </Modal>

        <Modal open={modal} onClose={() => setModal(false)}>
          <FormCreateTutor
            isModal={false}
            onSuccess={async (data: Tutor) => {
              await refetch();

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
