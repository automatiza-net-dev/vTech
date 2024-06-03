import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteAttendances implements domain.OpenAttendace, domain.UpdateAttendace {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  
  async open(params: domain.OpenAttendace.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`attendances/open`),
      method: "post",
      body: params
    });

    return response as domain.OpenAttendace.Model;
  }

  async update(params: domain.UpdateAttendace.Params) {

    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`attendances/update/${params.id}`),
      method: "put",
      body: params
    });

    return response as domain.UpdateAttendace.Model;
  }
}
