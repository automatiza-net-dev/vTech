import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadReturnablesSchedulePatient
  implements domain.LoadReturnablesSchedulePatient
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadReturnablesSchedulePatient.Model>
  ) {}
  async load(params: domain.LoadReturnablesSchedulePatient.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/returnables/${params.patientId}`),
      method: "get",
    });

    return response;
  }
}
