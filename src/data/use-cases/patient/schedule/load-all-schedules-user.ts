import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadAllSchedulesUser implements domain.LoadAllSchedulesUser {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadAllSchedulesUser.Model>
  ) {}

  async loadAll(params: domain.LoadAllSchedulesUser.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules/user"),
      method: "get",
      body: {
        ...params,
        working: true,
        unavailable: true,
      },
    });

    return response;
  }
}
