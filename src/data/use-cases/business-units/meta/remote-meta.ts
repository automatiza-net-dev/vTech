import { inject, injectable } from "inversify";

import * as domain from "@/domain";

import { InfraTypes } from "@/container/infra";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteMeta implements domain.LoadGoal, domain.CreateGoal {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async load(params: domain.LoadGoal.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("business-unit-metas"),
      method: "get",
      body: params
    });

    return response as domain.LoadGoal.Model;
  }

  async create(params: domain.CreateGoal.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("business-unit-metas"),
      method: "post",
      body: params
    });

    return response as domain.CreateGoal.Model;
  }
}
