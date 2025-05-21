import * as domain from "@/domain";
import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteAccessControls implements domain.LoadAccessControls, domain.UpdateAccessControls, domain.CreateCopyRole {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp) private readonly httpClient: any
  ) {}

  async load(params: domain.LoadAccessControls.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(params?.id ? ("roles/metadata/" + params.id) : "roles/schematics"),
      method: "get",
    });

    return response as domain.LoadAccessControls.Model;
  }

  async update(params: domain.UpdateAccessControls.Params) {
    const permissions = (params as any)?.roles?.reduce((reducer, role) => {
      return [...reducer, ...role.permissions];
    }, []);

     await this.httpClient.request({
      url: this.makeApiURL.make("roles/permissions"),
      method: "post",
      body: { data: [{ role: params.id, permissions }] },
    });

    return {}
  }

  async copy(params: domain.CreateCopyRole.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`roles/copy`),
      method: "post",
      body: params
    });

    return response
  }
}
