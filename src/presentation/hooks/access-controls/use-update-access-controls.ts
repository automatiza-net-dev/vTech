import { useMutation, useQueryClient } from "react-query";

import { useToast } from "infinity-forge";

import {
  RemoteAccessControls,
  RemoteControllerRole,
  RemoteUpdateDepartaments,
} from "@/data";
import { adminTypes, container } from "@/container";

export function useUpdateAccessControls({ roleId }: { roleId: number }) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  async function fetcher(data: any) {      

    await container
      .get<RemoteControllerRole>(adminTypes.RemoteControllerRole)
      .update({
        ...data.rolesControllerSearch,
        id: roleId,
      });

    await container
      .get<RemoteUpdateDepartaments>(adminTypes.RemoteUpdateDepartaments)
      .update({
        roleId,
        profileAccessIdList: data?.profileAccessIdList,
      });

    await container
      .get<RemoteAccessControls>(adminTypes.RemoteAccessControls)
      .update({
        id: String(roleId),
        roles: data?.data,
      });
  }

  return useMutation({
    mutationKey: "RemoteUpdateAccessControls",
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries("RemoteLoadAllControllerRoles");
      queryClient.invalidateQueries(["RemoteLoadAccessControls", roleId]);

      toast.success("Controle editado com sucesso!", {
        position: "top-right",
        autoClose: 4000,
      });
    },
    // onError: () => {
    //   toast.error("Não foi possível editar controle", {
    //     position: "top-right",
    //     autoClose: 4000,
    //   });
    // },
  });
}
