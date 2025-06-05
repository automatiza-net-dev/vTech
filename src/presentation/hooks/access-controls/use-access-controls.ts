
import { RemoteAccessControls } from "@/data";
import { adminTypes, container } from "@/container";
import { useQuery } from "infinity-forge";

export function useAccessControls({ id }) {
  async function fetcher() {
    return await container.get<RemoteAccessControls>(adminTypes.RemoteAccessControls).load({ id });
  }

  return useQuery({
    queryKey: ["RemoteLoadAccessControls", id],
    queryFn: fetcher,
    
  });
}
