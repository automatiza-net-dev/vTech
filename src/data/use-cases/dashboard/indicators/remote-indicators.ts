import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteIndicators implements domain.LoadIndicator {
  constructor(
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly http: domain.HttpClient,
    @inject(InfraTypes.makeApiURL)
    private readonly makeApiUrl: makeApiURL
  ) {}

  async loadAll(params: domain.LoadIndicator.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make("indicators/consolidated-reviewers-2"),
      method: "get",
      body: params,
    });

    return response as domain.LoadIndicator.Model;
  }
}
