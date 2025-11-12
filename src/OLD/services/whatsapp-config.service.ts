import api from "@/OLD/services";
import { AxiosResponse } from "axios";

type Config = {
  id: number;
  tintimClientId: string | null;
  whatsappPhone: string;
  platformIntegration: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  connectionStatus: string;
  connectionStatusDate: string;
  userUpdated: {
    id: string;
    name: string;
  };
  userCreated: {
    id: string;
    name: string;
  };
};

type ConfigMessage = {
  id: number;
  phone: string;
  platformIntegration: string;
  processed: boolean;
  processedMessage: string;
  last_event_interaction: string;
  event_created: string;
  created_at: string;
  payload: unknown;
};

const getConfigs = async (
  params: Record<string, any> = {},
): Promise<AxiosResponse<Config[]>> =>
  await api.get(`/whatsapp-messages-configs`, { params });

const showConfig = async (id: string): Promise<AxiosResponse<Config>> =>
  await api.get(`/whatsapp-messages-configs/${id}`);

const createConfig = async (data: {
  tintimClientId: string;
  whatsappPhone: string;
  platformIntegration: string;
}) => await api.post(`/whatsapp-messages-configs`, data);

const updateConfig = async (
  id: string,
  data: {
    tintimClientId: string;
    whatsappPhone: string;
    platformIntegration: string;
    active: boolean;
  },
) => await api.put(`/whatsapp-messages-configs/${id}`, data);

const removeConfig = async (id: string) =>
  await api.delete(`/whatsapp-messages-configs/${id}`);

const searchMessages = async (
  configID: string,
  params: {
    platformIntegration?: string;
    whatsappPhone?: string;
    startDate?: string;
    endDate?: string;
  } = {},
): Promise<AxiosResponse<ConfigMessage[]>> =>
  await api.get(`/webhooks/search-messages/${configID}`, { params });

export const whatsappConfigService = {
  getConfigs,
  showConfig,
  createConfig,
  updateConfig,
  removeConfig,
  searchMessages,
};
