import { useQuery } from "infinity-forge";
import { whatsappConfigService } from "@/OLD/services/whatsapp-config.service";

export const useWhatsappConfig = (filters: Record<string, string>) => {
  return useQuery({
    queryKey: ["whatsapp-config"],
    queryFn: async () => {
      const result = await whatsappConfigService.getConfigs(filters);
      return result.data;
    },
  });
};

export const useShowWhatsappConfig = (id: string) => {
  return useQuery({
    queryKey: ["whatsapp-config", "show", id],
    queryFn: async () => {
      const result = await whatsappConfigService.showConfig(id);
      return result.data;
    },
  });
};
