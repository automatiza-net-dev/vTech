import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";

import * as infinityForge from "infinity-forge";

@injectable()
export class RemoteMenu implements infinityForge.LoadAllMenu, infinityForge.CreateUser, infinityForge.DeleteUser, infinityForge.EditUser {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: infinityForge.makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp) private readonly httpClient: infinityForge.HttpClient,
  ) {}

  async loadAll(params?: infinityForge.LoadAllMenu.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make('menu'),
      method: 'get',
      body: params,
    })

    return response.data as infinityForge.LoadAllMenu.Model
  }

  async create(params: infinityForge.CreateUser.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make('Menu'),
      method: 'post',
      body: params,
    })

    return response.data as infinityForge.CreateUser.Model
  }

  async delete(params: infinityForge.DeleteUser.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`Menu/${params.id}`),
      method: 'delete',
    })

    return response.data
  }

  async edit(params: infinityForge.EditUser.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make('Menu'),
      method: 'put',
      body: params,
    })

    return response.data
  }

  async getDetail(params: infinityForge.LoadDetailUser.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`Menu/${params.id}`),
      method: 'get',
    })

    return response.data as infinityForge.LoadDetailUser.Model
  }
}
