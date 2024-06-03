import { inject, injectable } from "inversify";

import * as domain from "@/domain";

import { InfraTypes } from "@/container/infra";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteSystem implements domain.ReplaceTextTemplate {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async replace(params: domain.ReplaceTextTemplate.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("template-replacements/replace-text"),
      method: "post",
      body: params,
    });

    return response as domain.ReplaceTextTemplate.Model;
  }
}
