import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteChangeStatus implements domain.ChangeStatus {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.ChangeStatus.Model>
  ) {}
  async change(params: domain.ChangeStatus.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules/status"),
      method: "put",
      body: params,
    });

    return response;
  }
}
