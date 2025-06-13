import { useState } from "react";

import { ControllerRole } from "@/domain";
import { ButtonEdit } from "@/presentation";

import { FormEditAccessControls } from "./form-edit-access-controls";
import { Button, Modal, Input, FormHandler } from "infinity-forge";

export function Edit(
  props: Partial<ControllerRole & { filters: any; setFilters: any; refresh: any; }>,
) {
  const [modal, setModal] = useState(false);

  return (
    <>
      <Modal
        onClose={() => setModal(false)}
        open={modal}
        styles={{ maxWidth: "900px", width: "100%" }}
      >
        <FormEditAccessControls
          modal={modal}
          setModal={setModal}
          controllerRole={props}
        />
      </Modal>

      {props?.id ? (
        <ButtonEdit onClick={() => setModal(true)} />
      ) : (
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FormHandler
            cleanFieldsOnSubmit={false}
            initialData={props.filters}
            onChangeForm={{
              callbackResult: (formValues) => {
                props.setFilters({
                  name: formValues.name,
                });
              },
            }}
          >
            <Input
              label="Nome"
              name="name"
              onKeyDown={(ev) => {
                if (ev.key === "Enter") {
                  props?.refresh()
                }
              }}
            />
          </FormHandler>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: 10,
            }}
          >
            <Button
              type="button"
              onClick={() => setModal(true)}
              text="Criar controle de acesso"
            />
            <Button
              type="button"
              onClick={() => props?.refresh()}
              text="Filtrar"
            />
          </div>
        </div>
      )}
    </>
  );
}
