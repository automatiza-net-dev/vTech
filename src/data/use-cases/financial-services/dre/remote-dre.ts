import { inject, injectable } from "inversify";

import * as infra from "@/infra";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteDre
  implements
    domain.LoadDreReport,
    domain.LoadAllDreGroups,
    domain.CreateDreGroup,
    domain.EditDreGroup,
    domain.DeleteDreGroup
{
  constructor(
    @inject(InfraTypes.storage) private readonly storage: infra.Storage,
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async loadDreReport(params: domain.LoadDreReport.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`dre/spreadsheet/${params.unit}`),
      method: "get",
      body: params,
    });

    return response;
  }

  async loadAllDreGroups(params: domain.LoadAllDreGroups.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("dre-groups/search"),
      method: "get",
      body: params,
    });

    return response;
  }

  async createDreGroup(params: domain.CreateDreGroup.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("dre-groups/store"),
      method: "post",
      body: params,
    });

    return response;
  }

  async editDreGroup(params: domain.EditDreGroup.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("dre-groups/update"),
      method: "put",
      body: params,
    });

    return response;
  }

  async deleteDreGroup(params: domain.DeleteDreGroup.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`dre-groups/delete/${params?.id}`),
      method: "delete"
    })

    return response;
  }
}
