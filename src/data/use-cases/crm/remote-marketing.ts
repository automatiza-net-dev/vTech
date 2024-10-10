import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteMarketing
  implements
    domain.LoadMarketing,
    domain.CreateMarketing,
    domain.LoadMarketing,
    domain.UpdateMarketing,
    domain.DeleteMarketing,
    domain.LoadCampaings
{
  private url = "marketing-campaigns";

  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async loadCampaings(params: domain.LoadCampaings.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(this.url),
      method: "get",
      body: params,
    });

    return response as domain.LoadCampaings.Model;
  }

  async create(params: domain.CreateMarketing.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`${this.url}/store`),
      method: "post",
      body: params,
    });

    return response as domain.CreateMarketing.Model;
  }

  async load(params: domain.LoadMarketing.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`${this.url}/search`),
      method: "get",
      body: params,
    });

    return response as domain.LoadMarketing.Model;
  }

  async update(params: domain.UpdateMarketing.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`${this.url}/update`),
      method: "put",
      body: params,
    });

    return response as domain.UpdateMarketing.Model;
  }

  async delete(params: domain.DeleteMarketing.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`${this.url}/delete/${params?.id}`),
      method: "delete",
    });

    return response as domain.DeleteMarketing.Model;
  }
}
