import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteControllerRole implements domain.DeleteControllerRole, domain.LoadAllControllerRoles, domain.UpdateControllerRole {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}
  async loadAll() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("roles/controller"),
      method: "get",
    });

    return response as domain.LoadAllControllerRoles.Model;
  }

  async delete(params: domain.DeleteControllerRole.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("roles/controller/" + params.id),
      method: "delete",
    });

    return response;
  }

  async update(params: domain.UpdateControllerRole.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("roles/controller/" + params.id),
      method: "put",
      body: params,
    });

    return response;
  }
}
