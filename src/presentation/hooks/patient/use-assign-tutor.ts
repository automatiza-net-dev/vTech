import { useMutation } from "react-query";

import { RemoteTutor } from "@/data";
import { AssignTutor } from "@/domain";
import { container, patientTypes } from "@/container";

export function useAssignTutor() {
  
  async function fetcher(params: AssignTutor.Params) {
    const response = await container.get<RemoteTutor>(patientTypes.RemoteTutor).assign(params);

    return response;
  }

  return useMutation("RemoteAssignTutor", fetcher);
}
