import { useMutation, useQueryClient } from "react-query";

import { useToast } from "infinity-forge";

import { UserController } from "@/domain";
import { RemoteUserController } from "@/data";
import { adminTypes, container } from "@/container";

export function useDeleteUserController(id: UserController["id"]) {
  const { toast } = useToast()
  const queryClient = useQueryClient();

  async function fetcher() {
    if(id)
    await container.get<RemoteUserController>(adminTypes.RemoteUserController).delete({ id });

    queryClient.invalidateQueries("RemoteLoadUserControllers");
    toast.success("Colaborador excluido com sucesso", { position: "top-right", autoClose: 4000 })
  }

  return useMutation({
    mutationKey: "RemoteDeleteUserController",
    mutationFn: fetcher,
    onError: () => {
      toast.error("Falha ao tentar excluir colaborador", { position: "top-right", autoClose: 4000 })
    },
  });
}
