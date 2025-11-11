import api from "@/OLD/services";
import { AxiosResponse } from "axios";

type Config = {
  id: number;
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

const getConfigs = async (
  params: Record<string, any> = {},
): Promise<AxiosResponse<Config[]>> =>
  await api.get(`/whatsapp-messages-configs`, { params });

const showConfig = async (id: string): Promise<AxiosResponse<Config>> =>
  await api.get(`/whatsapp-messages-configs/${id}`);

const createConfig = async (data: {
  whatsappPhone: string;
  platformIntegration: string;
}) => await api.post(`/whatsapp-messages-configs`, data);

const updateConfig = async (
  id: string,
  data: {
    whatsappPhone: string;
    platformIntegration: string;
    active: boolean;
  },
) => await api.put(`/whatsapp-messages-configs/${id}`, data);

const removeConfig = async (id: string) =>
  await api.delete(`/whatsapp-messages-configs/${id}`);

export const whatsappConfigService = {
  getConfigs,
  showConfig,
  createConfig,
  updateConfig,
  removeConfig,
};
