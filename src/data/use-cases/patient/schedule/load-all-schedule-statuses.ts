import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadAllScheduleStatuses
  implements domain.LoadAllScheduleStatuses
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadAllScheduleStatuses.Model>
  ) {}
  async loadAll(params: domain.LoadAllScheduleStatuses.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedule-statuses"),
      method: "get",
      body: params,
    });

    return response;
  }
}
