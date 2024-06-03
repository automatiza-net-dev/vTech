import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadSchedulesPatient implements domain.LoadSchedulesPatient {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadSchedulesPatient.Model>
  ) {}
  async load(params: domain.LoadSchedulesPatient.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patients/animals"),
      method: "get",
      body: params,
    });

    return response;

  }
}
