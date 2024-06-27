import { Bill, TimeLine } from "@/domain";

export type RequestPrinting = {
  requestPrinting: (params: RequestPrinting.Params) => Promise<{}>;
};

export namespace RequestPrinting {
  export type Params = {
    billDocumentId?: Bill["id"];
    timelineId?: TimeLine["_id"];
  };
}
