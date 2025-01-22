import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemotePatientReports implements domain.LoadAllPatientReports {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async loadAllPatientReports(params: domain.LoadAllPatientReports.Params) {
   const response = await this.httpClient.request({
      url: this.makeApiURL.make(`reports/patients`),
      method: "get",
      body: params,
    });

    return response
  }
}
