import { useMutation, useQueryClient } from "react-query";

import { BadRequestError, useToast } from "infinity-forge";

import { RemoteVaccine } from "@/data";
import { DeleteVaccine } from "@/domain";
import { patientTypes, container } from "@/container";

export function useDeleteVaccine(params: DeleteVaccine.Params) {
  const { createToast } = useToast();

  const queryClient = useQueryClient();

  async function fetcher() {
    await container
      .get<RemoteVaccine>(patientTypes.RemoteVaccine)
      .delete(params);
  }

  return useMutation({
    mutationKey: "RemoteDeleteVaccine",
    mutationFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries("RemoteDeleteVacine");

      createToast({
        message: "Vacina removida com sucesso!",
        status: "success",
      });
    },
    onError: (err: { message: string }) => {
      if (err instanceof BadRequestError) {
        createToast({ message: err.error.message, status: "success" });
      }
    },
  });
}
