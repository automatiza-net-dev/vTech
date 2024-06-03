import { useEffect, useState } from "react";
import { clinicService } from "@/OLD/services/clinic.service";

export const useClinic = (reload) => {
  const [clinics, setClinics] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    clinicService
      .getClinicsByUser()
      .then((res) => setClinics(res.data))
      .catch((_err) => setLoading(false))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [reload]);

  return {
    loadingClinics: loading,
    clinics,
    fetchClinics: fetchData,
  };
};

//TODO NO GET ESTÁ VINDO fantasy_name, diferente do editar e do criar e não só este campo mas outros estão diferentes o que vai causar problemas na hora de trazer os dados, GERMANO alterar para não bugar a tela.
export type Clinica = {
  id?: string;
  postalCode?: string;
  address?: string;
  district?: string;
  state?: string;
  identification?: string;
  email?: string;
  city?: string;
  simple?: boolean;
  phone?: string;
  economic_group_id?: string;
  document?: string;
  number?: string;
  complement?: string;
  fantasyName?: string;
  companyName?: string;
};

export const useSingleClinic = (id) => {
  const [clinic, setClinic] = useState<Clinica | null>(null);

  useEffect(() => {
    if(id) 
    clinicService
    .getClinicById(id)
    .then((res) => setClinic(res.data))
  }, [id]);

  return {
    clinic,
  };
};
