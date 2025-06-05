import { useMutation, useQueryClient } from "infinity-forge"

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
      .deleteVaccine(params);
  }

  return useMutation({
    queryKey: ["RemoteDeleteVaccine"],
    queryFn: fetcher,
    onSuccess: () => {
      queryClient.invalidateQueries(["RemoteDeleteVacine"]);

      createToast({
        message: "Vacina removida com sucesso!",
        status: "success",
      });
    },
    onError: (err) => {
      if (err instanceof BadRequestError) {
        createToast({ message: err.error.message, status: "success" });
      }
    },
  });
}
