import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemotePatientAnimal implements domain.LoadAllPathologies, domain.AddPathologieInTimeLine {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp) private readonly httpClient: domain.HttpClient
  ) {}
  async loadAllPathologies() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`pathologies`),
      method: "get",
    });

    return response as domain.LoadAllPathologies.Model;
  }

  async addPathologieInTimeLine(params: domain.AddPathologieInTimeLine.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`n-timeline/pathologies`),
      method: "post",
      body: params
    });

    return response;
  }
}
