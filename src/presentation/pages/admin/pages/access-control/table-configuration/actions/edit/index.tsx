import { useState } from "react";

import { ControllerRole } from "@/domain";
import { ButtonEdit } from "@/presentation";

import { FormEditAccessControls } from "./form-edit-access-controls";
import { Button, Modal } from "infinity-forge";

export function Edit(props: Partial<ControllerRole>) {
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
        <div style={{ marginBottom: 20 }}>
          <Button
            type="button"
            onClick={() => setModal(true)}
            text="Criar controle de acesso"
          />
        </div>
      )}
    </>
  );
}
