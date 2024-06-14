import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteProduct implements domain.LoadAllProducts {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async loadAll() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`budgets/products`),
      method: "get",
    });

    return response as domain.LoadAllProducts.Model;
  }
}
