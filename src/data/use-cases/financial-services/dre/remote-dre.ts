import { inject, injectable } from "inversify";

import * as infra from "@/infra";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteDre implements domain.LoadDreReport {
  constructor(
    @inject(InfraTypes.storage) private readonly storage: infra.Storage,
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async loadDreReport(params: domain.LoadDreReport.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`dre/spreadsheet/${params.unit}`),
      method: "get",
      body: params,
    });

    return response;
  }
}
