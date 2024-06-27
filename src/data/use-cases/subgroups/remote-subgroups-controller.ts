import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteSubgroups
  implements domain.LoadSubgroupDetails, domain.LoadSubgroups
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiUrl: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async loadAll(params: domain.LoadSubgroups.Params) {
    return await this.httpClient.request({
      url: this.makeApiUrl.make(`subgroups`),
      method: "get",
      body: params,
    });
  }

  async loadDetails(params: domain.LoadSubgroupDetails.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiUrl.make(`indicators/invoicing-product-type-subgroup`),
      method: "get",
      body: params,
    });

    return response as domain.LoadSubgroupDetails.Model;
  }
}
