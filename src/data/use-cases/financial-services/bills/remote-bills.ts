import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteBills implements domain.CreateBill {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async create(params: domain.CreateBill.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`bills/create`),
      method: "post",
      body: params,
    });

    return response as domain.CreateBill.Model;
  }
}
