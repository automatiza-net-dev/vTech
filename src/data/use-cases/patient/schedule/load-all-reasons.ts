import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadAllReasons implements domain.LoadAllReasons {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadAllReasons.Model>
  ) {}
  async loadAll(params: domain.LoadAllReasons.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("reasons"),
      method: "get",
      body: params,
    });

    return response;
  }
}
