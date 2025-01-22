//@ts-nocheck
import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteCommission
  implements domain.CommissionConference, domain.CommissionConsolidated
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async loadAllCommissionsConference(
    params: domain.LoadAllCommissionReportsConference.Params
  ) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("reports/comission-seller-conference"),
      method: "get",
      body: params,
    });

    return response as domain.LoadAllCommissionReportsConference.Model;
  }

  async loadAllCommissionsConsolidated(
    params: domain.LoadAllCommissionReportsConsolidated.Params
  ) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("reports/comission-seller-consolidated"),
      method: "get",
      body: params,
    });

    return response as domain.LoadAllCommissionReportsConsolidated.Model;
  }
}
