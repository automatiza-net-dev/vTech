import { useState } from "react";

import {
  ButtonEdit,
  ButtonDelete,
  useAuthFranchisor,
  useDeleteUserController,
} from "@/presentation";
import { FormUserController } from "../../components";

export function ActionsListUserController(props) {
  const [modal, setModal] = useState(false);
  const { mutateAsync, isLoading } = useDeleteUserController(props.id);

  const { user } = useAuthFranchisor();

  const isActualUser = props.id === user?.user?.id;

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
        <ButtonDelete onClick={() => mutateAsync()} disabled={isLoading} />
      )}
    </div>
  );
}
