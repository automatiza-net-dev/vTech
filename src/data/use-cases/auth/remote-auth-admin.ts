import { inject, injectable } from "inversify";

import * as domainVtech from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteAuthAdmin implements domainVtech.AuthAdmin {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.storage) private readonly storage: domainVtech.StorageVtech,
    @inject(InfraTypes.authorizeAdminHttp) private readonly httpClient: domainVtech.HttpClient<domainVtech.AuthAdmin.Model>
  ) {}
  async auth(params: domainVtech.AuthAdmin.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("auth/admin-login"),
      method: "post",
      body: params,
    });

    this.storage.set("adminUser", { value: response?.token?.token });

    return response as domainVtech.AuthAdmin.Model;
  }
}
