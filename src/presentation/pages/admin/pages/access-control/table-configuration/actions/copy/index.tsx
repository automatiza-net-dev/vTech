import { RemoteAccessControls } from "@/data";
import { adminTypes, container } from "@/container";

import { ControllerRole } from "@/domain";
import { ButtonCopy, useQueryClient } from "@/presentation";
import { useToast } from "infinity-forge";

export function Copy(props: ControllerRole) {
  const { createToast } = useToast();

  const queryClient = useQueryClient()

  return (
    <ButtonCopy
      onClick={async () => {
        await container
          .get<RemoteAccessControls>(adminTypes.RemoteAccessControls)
          .copy({ roleId: String(props.id) });

        await queryClient.refetch(["RemoteLoadAllControllerRoles"]);

        createToast({
          message: "Role duplicada com sucesso!",
          status: "success",
        });
      }}
    />
  );
}
