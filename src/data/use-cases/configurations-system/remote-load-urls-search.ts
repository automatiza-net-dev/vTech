import { inject, injectable } from "inversify";

import * as domain from "@/domain";

import { InfraTypes } from "@/container/infra";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteLoadUrlsSearch implements domain.LoadUrlsSearch {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp)
    private readonly httpClient: domain.HttpClient<domain.LoadUrlsSearch.Model>
  ) {}
  async load(params: domain.LoadUrlsSearch.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("urls/search"),
      method: "post",
      body: params,
    });

    return response;
  }
}
