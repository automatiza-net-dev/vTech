import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteLoadProfessionalsSchedule
  implements domain.LoadProfessionalsSchedule
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadProfessionalsSchedule.Model>
  ) {}

  async load() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules/with-schedule"),
      method: "get",
    });

    return response;
  }
}
