export type BusinessEconomicGroup = {
  id: string;
  fantasy_name: string;
  company_name: string;
  document: null;
  responsible_email: string;
  responsible_phone: string;
};

export type BusinessUnit = {
  id: string;
  identification: string | null;
  document: null;
  fantasy_name: null;
  company_name: string;
  email: string;
  phone: string;
  origin: string;
  postal_code: null;
  address: null;
  number: null;
  complement: null;
  district: null;
  city: null;
  state: null;
  group: string;
  lat: null;
  lng: null;
  cnae: null;
  simple: boolean;
  city_code: null;
  state_registration: null;
  city_registration: null;
  economicGroup: BusinessEconomicGroup;
};
