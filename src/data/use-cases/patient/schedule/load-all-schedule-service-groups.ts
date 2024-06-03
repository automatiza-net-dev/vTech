import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadAllScheduleServicesGroups
  implements domain.LoadAllScheduleServicesGroups
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadAllScheduleServicesGroups.Model>
  ) {}
  async loadAll(params: domain.LoadAllScheduleServicesGroups.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedule-service-groups"),
      method: "get",
      body: params,
    });

    return response;
  }
}
