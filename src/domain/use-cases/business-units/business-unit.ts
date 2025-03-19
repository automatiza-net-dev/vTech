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
  identification: string;
  document: string;
  fantasy_name: null;
  company_name: string;
  companyName: string;
  email: string;
  fantasyName: string;
  phone: string;
  origin: string;
  postal_code: string;
  address: string;
  number: number;
  complement: string;
  district: string;
  city: string;
  state: string;
  group: string;
  lat: null;
  lng: null;
  postalCode: string;
  cnae: string;
  simple: boolean;
  city_code: string;
  state_registration: string;
  city_registration: string;
  economicGroup: BusinessEconomicGroup;
};


