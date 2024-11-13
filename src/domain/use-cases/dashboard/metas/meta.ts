export type IMeta = {
  active: boolean;
  created_at: Date;
  description: string;
  group: {
    id: string;
    company_name: string;
  };
  id: number;
  type: string;
  updated_at: Date;
};
