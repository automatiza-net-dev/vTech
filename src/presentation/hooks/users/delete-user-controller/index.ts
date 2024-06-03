import { useMutation, useQueryClient } from "react-query";

import { useToast } from "infinity-forge";

import { UserController } from "@/domain";
import { RemoteUserController } from "@/data";
import { adminTypes, container } from "@/container";

export function useDeleteUserController(id: UserController["id"]) {
  const { createToast } = useToast()
  const queryClient = useQueryClient();

  async function fetcher() {
    if(id)
    await container.get<RemoteUserController>(adminTypes.RemoteUserController).delete({ id });

    queryClient.invalidateQueries("RemoteLoadUserControllers");
    createToast({ message: "Colaborador excluido com sucesso", status: "success" })
  }

  return useMutation({
    mutationKey: "RemoteDeleteUserController",
    mutationFn: fetcher,
    onError: () => {
      createToast({ message: "Falha ao tentar excluir colaborador", status: "error" })
    },
  });
}
