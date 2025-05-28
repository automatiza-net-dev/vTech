import { useMutation } from "@/presentation/use-query";

import { RemoteTutor } from "@/data";
import { SetMainTutor } from "@/domain";
import { container, patientTypes } from "@/container";

export function useSetMainTutor() {

  async function fetcher(params: SetMainTutor.Params) {
    const response = await container.get<RemoteTutor>(patientTypes.RemoteTutor).setMain(params);

    return response;
  }

  return useMutation({ queryKey: ["RemoteSetMainTutor"], queryFn: fetcher });
}
