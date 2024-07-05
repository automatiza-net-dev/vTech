

import { inject, injectable } from 'inversify'

import * as infinityForge from 'infinity-forge'

import * as domain from "@/domain"

@injectable()
export class RemoteConfiguration implements domain.LoadAllDictionary {
  constructor(
    @inject(infinityForge.InfraTypes.makeApiURL) private readonly makeApiURL: infinityForge.makeApiURL,
    @inject(infinityForge.InfraTypes.authorizeDashboardHttp) private readonly httpClient: infinityForge.HttpClient<any>,
  ) {}
  async loadAllDictionary() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make('dictionary'),
      method: 'get',
    })

    return response as domain.LoadAllDictionary.Model
  }
}
