import { useMutation, useQueryClient } from "react-query";
import { useToast } from "infinity-forge";

import { CreateCopyRole } from "@/domain";
import { RemoteAccessControls } from "@/data";
import { adminTypes, container } from "@/container";

export function useCopyRole(params: CreateCopyRole.Params) {
  const queryClient = useQueryClient();
  const { createToast } = useToast()

  async function fetcher() {
   return await container.get<RemoteAccessControls>(adminTypes.RemoteAccessControls).copy(params);
  }

  return useMutation({
    mutationKey: "RemoteCreateCopyRole",
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries("RemoteLoadAllControllerRoles");

      createToast({ message: "Role duplicada com sucesso!", status: "success"})
    },
  });
}
