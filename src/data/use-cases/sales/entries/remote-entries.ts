import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteEntries implements domain.LoadAllEntries {
    constructor(
        @inject(InfraTypes.authorizeDashboardHttp)
        private readonly http: domain.HttpClient,
        @inject(InfraTypes.makeApiURL)
        private readonly makeApiUrl: makeApiURL
    ){}

    async loadAll(params: domain.LoadAllEntries.Params) {
       const response = await this.http.request({ url: this.makeApiUrl.make("receipts"), method: "get", body: params });

    //    switch(response.staus) {
    //     case HttpStatusCode.ok: return response.data
    //    }

       return { items: response } as domain.LoadAllEntries.Model
    }

    async delete(params: { id: string }) {
        const response = await this.http.request({ url: this.makeApiUrl.make("/receitas/deletar"), method: "delete", body: params });

        return response
    }

    async getDetail(params: { id: string }) {
        const response = await this.http.request({ url: this.makeApiUrl.make("/receipts/show"), method: "delete", body: params });

        return response
    }
}

