import { inject, injectable } from "inversify";

import * as domain from "@/domain";

import { InfraTypes } from "@/container/infra";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteBusinessUnits
  implements
    domain.SwapUnit,
    domain.LoadAllBusinessUnits,
    domain.LoadAllBusinessUsers
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp)
    private readonly httpClientAdmin: domain.HttpClient,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async loadAll() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("business-units"),
      method: "get",
    });

    return response as domain.LoadAllBusinessUnits.Model;
  }

  async load(params: domain.LoadBusinessUnits.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`business-units/${params?.id}`),
      method: "get",
    });

    return response as domain.LoadBusinessUnits.Model;
  }

  async loadAllUsers() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("business-units/users"),
      method: "get",
    });

    return response as domain.LoadAllBusinessUsers.Model;
  }

  async swap(params: domain.SwapUnit.Params & { dashboard?: boolean }) {
    const HTTP = params.dashboard ? this.httpClient : this.httpClientAdmin;

    const response = await HTTP.request({
      url: this.makeApiURL.make("auth/swap-unit"),
      method: "post",
      body: params,
    });

    return response;
  }

  async loadAllAvailableSwaps(params: { dashboard?: boolean }) {
    const HTTP = params.dashboard ? this.httpClient : this.httpClientAdmin;

    const response = await HTTP.request({
      url: this.makeApiURL.make("auth/available-swaps"),
      method: "get",
    });

    return response as { id: string; identification: string; group: string }[];
  }
}
