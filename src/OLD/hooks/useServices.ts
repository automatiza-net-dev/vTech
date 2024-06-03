import { useEffect, useState, useCallback } from "react";

import { servicesService } from "@/OLD/services/services.service";

import { notification } from "antd";

export const useServices = (filters, reload) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);

    if (filters?.noSearch) {
      return;
    }

    servicesService
      .getAllServices(filters)
      .then((res) => setServices(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload, filters]);

  return {
    services,
    loadingServices: loading,
    fetchServices: fetchData,
  };
};

export const useCreateService = (data) => {
  const [loading, setLoading] = useState(false);

  const createService = useCallback(() => {
    setLoading(true);

    servicesService
      .createService(data)
      .then((_res) =>
        notification.success({ message: "Serviço criado com sucesso!" })
      )
      .catch((_err) => {
        setLoading(false);
        return notification.success({
          message:
            "Houve um erro ao criar o serviço, verifique os campos informados",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [data]);

  return {
    createService,
    loadingCreateService: loading,
  };
};

export const useUpdateService = (id, data) => {
  const [loading, setLoading] = useState(false);

  const updateService = useCallback(() => {
    servicesService
      .updateService(id, data)
      .then((_res) =>
        notification.success({ message: "Serviço atualizado com sucesso!" })
      )
      .catch((_err) => {
        setLoading(false);
        notification.error({
          message: "Houve um erro ao atualizar o serviço...",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    updateService,
    loadingUpdateService: loading,
  };
};
