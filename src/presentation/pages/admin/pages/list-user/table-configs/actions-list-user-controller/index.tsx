import { useState } from "react";

import {
  ButtonEdit,
  ButtonDelete,
  useDeleteUserController,
} from "@/presentation";
import { User } from "@/domain";
import { FormUserController } from "../../components";
import { useAuthAdmin } from "infinity-forge";

export function ActionsListUserController(props) {
  const [modal, setModal] = useState(false);
  const { mutateAsync, isLoading } = useDeleteUserController(props.id);

  const {GetUser} = useAuthAdmin()

  const user = GetUser<User>()

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
