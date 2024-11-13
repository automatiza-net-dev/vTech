export type OpportunitieSchedule = {
  id: number;
  scheduleId?: string;
  description: string;
  contactDate: string;
  contact: {
    id: string;
    name: string;
  };
  client: { id: string, name: string } | null;
  status: {
    id: number;
    description: string;
  };
};
