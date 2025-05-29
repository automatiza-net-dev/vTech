import { useState } from "react";
import { useAuthAdmin, useToast } from "infinity-forge";
import { useQueryClient } from "@/presentation/use-query"

import { ButtonEdit, ButtonDelete } from "@/presentation";
import { FormUserController } from "../../components";

import { RemoteUserController } from "@/data";
import { adminTypes, container } from "@/container";

export function ActionsListUserController(props) {
  const [modal, setModal] = useState(false);

  const { user } = useAuthAdmin();
  const { createToast } = useToast();

  const isActualUser = props.id === user?.user?.id;

  const {refetch} = useQueryClient();

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
      {modal && (
        <FormUserController
          modal={modal}
          setModal={setModal}
          userController={props}
        />
      )}

      <ButtonEdit onClick={() => setModal(true)} />

      {!isActualUser && (
        <ButtonDelete
          onClick={async () => {
            await container
              .get<RemoteUserController>(adminTypes.RemoteUserController)
              .delete({ id: props.id });

            refetch(["RemoteLoadUserControllers"]);

            createToast({
              message: "Colaborador excluido com sucesso",
              status: "success",
            });
          }}
        />
      )}
    </div>
  );
}
