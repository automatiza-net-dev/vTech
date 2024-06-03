import { useState } from "react";

import { ControllerRole } from "@/domain";
import { ButtonEdit } from "@/presentation";

import { FormEditAccessControls } from "./form-edit-access-controls";

export function Edit(props: ControllerRole) {
  const [modal, setModal] = useState(false);

  return (
    <>
      {modal && (
        <FormEditAccessControls
          modal={modal}
          setModal={setModal}
          controllerRole={props}
        />
      )}
      
      <ButtonEdit onClick={() => setModal(true)} />
    </>
  );
}
