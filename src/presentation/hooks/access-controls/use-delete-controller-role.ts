import { useMutation, useQueryClient } from "react-query";

import { BadRequestError, useToast } from "infinity-forge";

import { RemoteControllerRole } from "@/data";
import { DeleteControllerRole } from "@/domain";
import { adminTypes, container } from "@/container";

export function useDeleteControllerRole(params: DeleteControllerRole.Params) {
  const { createToast } = useToast()
  
  const queryClient = useQueryClient();

  async function fetcher() {
    await container.get<RemoteControllerRole>(adminTypes.RemoteControllerRole).delete(params);
  }

  return useMutation({
    mutationKey: "RemoteDeleteControllerRole",
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries("RemoteLoadAllControllerRoles");

      createToast({ message: "Controle excluido com sucesso!", status: "success"})
    },
    onError: (err: { message: string }) => {
      if(err instanceof BadRequestError) {
        createToast({ message: err.error.message, status: "success"})
      }
    },
  });
}
