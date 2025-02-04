import { RemoteAccessControls } from "@/data";
import { adminTypes, container } from "@/container";

import { ControllerRole } from "@/domain";
import { ButtonCopy } from "@/presentation";
import { useQueryClient, useToast } from "infinity-forge";

export function Copy(props: ControllerRole) {
  const { createToast } = useToast();
  const refetch = useQueryClient((state) => state.refetch);

  return (
    <ButtonCopy
      onClick={async () => {
        await container
          .get<RemoteAccessControls>(adminTypes.RemoteAccessControls)
          .copy({ roleId: String(props.id) });

        await refetch("RemoteLoadAllControllerRoles");

        createToast({
          message: "Role duplicada com sucesso!",
          status: "success",
        });
      }}
    />
  );
}
