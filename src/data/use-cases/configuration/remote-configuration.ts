

import { inject, injectable } from 'inversify'

import { InfraTypes } from "@/container/infra";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain"

@injectable()
export class RemoteConfiguration implements domain.LoadAllDictionary {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp) private readonly httpClient: domain.HttpClient<any>,
  ) {}
  async loadAllDictionary() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make('dictionary'),
      method: 'get',
    })

    return response as domain.LoadAllDictionary.Model
  }
}
