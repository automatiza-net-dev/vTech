import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteInvite implements domain.LoadInvite {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async load(params: domain.LoadInvite.Params) {
    return await this.httpClient.request({
      url: this.makeApiURL.make(`invites/${params?.id}`),
      method: "get",
    });
  }
}
