import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteMetas
  implements
    domain.LoadMetas,
    domain.CreateMetas,
    domain.UpdateMetas,
    domain.DeleteMetas,
    domain.PerfomanceRange,
    domain.LoadPerfomanceRange
{
  constructor(
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly http: domain.HttpClient,
    @inject(InfraTypes.makeApiURL)
    private readonly makeApiUrl: makeApiURL
  ) {}

  async loadAll(params: domain.LoadMetas.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make("metas"),
      method: "get",
      body: params,
    });

    return response as domain.LoadMetas.Model;
  }

  async create(params: domain.CreateMetas.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make("metas"),
      method: "post",
      body: params,
    });

    return response as domain.CreateMetas.Model;
  }

  async update(params: domain.UpdateMetas.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make(`metas/${params.id}`),
      method: "put",
      body: params,
    });

    return response as domain.UpdateMetas.Model;
  }

  async delete(params: domain.DeleteMetas.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make(`metas/${params.id}`),
      method: "delete",
    });

    return response as domain.DeleteMetas.Model;
  }

  async perfomanceRange(params: domain.PerfomanceRange.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make(`performance-range-goals/update`),
      method: "put",
      body: params,
    });

    return response as domain.PerfomanceRange.Model;
  }

  async loadPerfomanceRange(params: domain.LoadPerfomanceRange.params) {
    const response = await this.http.request({
      url: this.makeApiUrl.make(`performance-range-goals/search/${params?.id}`),
      method: "get",
      body: params,
    });

    return response as domain.LoadPerfomanceRange.Model;
  }
}
