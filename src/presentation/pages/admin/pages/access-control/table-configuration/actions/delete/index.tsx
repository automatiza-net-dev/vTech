import { useQueryClient, useToast } from "infinity-forge";

import { ControllerRole } from "@/domain";
import { ButtonDelete } from "@/presentation";
import { RemoteControllerRole } from "@/data";
import { adminTypes, container } from "@/container";

export function Delete(props: ControllerRole) {
  const { createToast } = useToast()

  const refetch = useQueryClient(s => s.refetch)

  return (
    <ButtonDelete onClick={async () => {
        await container.get<RemoteControllerRole>(adminTypes.RemoteControllerRole).delete({
          id: String(props.id),
        });

        await refetch(["RemoteLoadAllControllerRoles"], { mode: "include" });

        createToast({ message: "Controle excluido com sucesso!", status: "success"})
    }} />
  );
}
