import { Event, User } from "@/domain";

export type LoadScheduleIdMock = {
  loadScheduleIdMock: (params: LoadScheduleIdMock.Params) => Promise<{}>;
};

export namespace LoadScheduleIdMock {
  export type Params = {
    id: Event["event"]["id"];
  };

  export type Model = {
    id: Event["event"]["id"];
    name: User["name"];
    start_hour: Date | null;
    finished_at: Date | null;
  }[];
}
