import { Event } from "@/domain";

export type ReturnableEvent = {
  id_agenda: string;
  reschedules: {
    id: Event["event"]["id"];
    reason: Event["event"]["reason"];
    createdAt: string;
    observation: Event["event"]["observation"];
  }[];
  contacts: {
    id: number;
    observation: string;
    contact_date: string;
  }[];
  status_changes: {
    id: number;
    created_at: string;
    observation: string | null;
  }[];
};
