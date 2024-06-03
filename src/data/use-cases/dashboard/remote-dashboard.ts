import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteDashboard implements domain.LoadDashboard {
  constructor(
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly http: domain.HttpClient,
    @inject(InfraTypes.makeApiURL)
    private readonly makeApiUrl: makeApiURL
  ) {}

  async loadAll(params: domain.LoadDashboard.Params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make("dashboard"),
      method: "get",
      body: params,
    });

    return response as domain.LoadDashboard.Model;
  }
}
