import { Event } from "@/domain";

export type LoadAllSynchedTreatmentItems = {
  loadSynchedTreatmentItems: (
    params: LoadSynchedTreatmentItems.Params,
  ) => Promise<any>;
};

export namespace LoadSynchedTreatmentItems {
  export type Params = {
    eventId?: Event["event"]["id"] | null;
  };

  export type Model = {
    items: {
      treatmentId: number;
      treatmentItemId: number;
      productId: string;
      productDescription: string;
      executions: {
        treatmentExecutionId: number;
        productivityItemId: number;
        productivityItemDescription: string;
        executionUserId: string | null;
        executionUserName: string | null;
        executionDate: string | null;
      }[];
    }[];
  }[];
}
