export type Vaccine = {
  created_at: string;
  description: string;
  id: string;
  name: string;
  reserved_for_system: boolean;
  type: "vaccine" | "vermifuge";
  updated_at: string;
  active?: boolean;
  subgroupId?: string;
};
