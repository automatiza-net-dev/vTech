import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteUserController implements domain.CreateUserController, domain.UpdateUserController, domain.LoadUserControllers, domain.DeleteUserController {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeAdminHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}
  
  async load() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("users/fetch-user-controllers"),
      method: "get",
    });

    return response as domain.LoadUserControllers.Model;
  }

  async create(params: domain.CreateUserController.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("users/create-user-controller"),
      method: "post",
      body: params,
    });

    return response;
  }

  async update(params: domain.UpdateUserController.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("users/update-user-controller"),
      method: "post",
      body: params,
    });

    return response as domain.UpdateUserController.Model;
  }

  async delete(params: domain.DeleteUserController.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("users/delete-user-controller/" + params.id),
      method: "delete",
    });

    return response as domain.LoadUserControllers.Model;
  }
}
