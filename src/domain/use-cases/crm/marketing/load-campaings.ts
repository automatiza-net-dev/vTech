import { Marketing } from "./marketing";

export type LoadCampaings = {
  loadCampaings: (params: LoadCampaings.Params) => void;
};

export namespace LoadCampaings {
  export type Params = {
    clientOriginId: Marketing["clientOrigins"][0]["clientOriginId"];
    active: boolean;
  };

  export type Model = any[];
}
