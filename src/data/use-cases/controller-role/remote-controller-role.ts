import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteControllerRole
  implements domain.DeleteControllerRole, domain.LoadAllControllerRoles, domain.UpdateControllerRole
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  private getUrl(path: string) {
    const base = this.makeApiURL.make("");
    const hasAdmin = base.includes("admin");
    return this.makeApiURL.make(hasAdmin ? `roles/controller/${path}` : `roles/${path}`);
  }

  async loadAll() {
    const response = await this.httpClient.request({
      url: this.getUrl(""),
      method: "get",
    });

    return response as domain.LoadAllControllerRoles.Model;
  }

  async delete(params: domain.DeleteControllerRole.Params) {
    const response = await this.httpClient.request({
      url: this.getUrl(params.id),
      method: "delete",
    });

    return response;
  }

  async update(params: domain.UpdateControllerRole.Params) {
    const response = await this.httpClient.request({
      url: this.getUrl(String(params.id)),
      method: "put",
      body: params,
    });

    return response;
  }
}
