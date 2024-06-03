import * as domain from "@/domain";
import { inject, injectable } from "inversify";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteUpdateDepartaments implements domain.UpdateDepartaments {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp) private readonly httpClient: any
  ) {}

  async update(params: domain.UpdateDepartaments.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make("external/sync"),
      method: "post",
      body: params,
    });

    return {};
  }
}
