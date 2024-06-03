import { inject, injectable } from "inversify";

import {User } from "@/domain";
import * as domain from "infinity-forge";
import * as domainAutomatiza from "@/domain"
import { InfraTypes } from "@/container/infra/types";

@injectable()
export class RemoteLoadUserDashboard  {
  constructor(
    @inject(InfraTypes.makeApiURL)
    private readonly makeApiURL: domain.makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domainAutomatiza.HttpClient<User>,
    @inject(InfraTypes.authorizeAdminHttp)
    private readonly httpClientAdmin: domainAutomatiza.HttpClient<User>
  ) {}
  async load(params: { admin?:  boolean }) {
    const HTTP = params?.admin ? this.httpClientAdmin : this.httpClient

    const response = await HTTP.request({
      url: this.makeApiURL.make("auth/me"),
      method: "get",
    });

    const UserAdminInfinityForgeRequirment = {
      avatar: response.user?.profile_picture || "",
      emailAddress: response?.user?.email || "",
      firstName: response?.user?.name || "",
      id: (response as any).user.id || "",
      imagem: response.user?.profile_picture,
      isExternal: false,
      lastName: "",
    };

    return { ...response, ...UserAdminInfinityForgeRequirment } as User;
  }
}
