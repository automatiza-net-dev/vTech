import { useQuery } from "react-query";

import { RemoteAccessControls } from "@/data";
import { callApiOneTime } from "@/presentation";
import { adminTypes, container } from "@/container";

export function useAccessControls({ id }) {
  async function fetcher() {
    return await container.get<RemoteAccessControls>(adminTypes.RemoteAccessControls).load({ id });
  }

  return useQuery({
    queryKey: ["RemoteLoadAccessControls", id],
    queryFn: fetcher,
    ...callApiOneTime,
  });
}
