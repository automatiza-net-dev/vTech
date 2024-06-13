import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteDailyMovements implements domain.LoadAllDailyMovements {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async loadAllDailyMovements() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`daily-movements`),
      method: "get",
    });

    return response as domain.LoadAllDailyMovements.Model;
  }
}
