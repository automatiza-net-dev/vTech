import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteReportsEntries implements domain.LoadAllEntriesReports {
    constructor(
        @inject(InfraTypes.authorizeDashboardHttp)
        private readonly http: domain.HttpClient,
        @inject(InfraTypes.makeApiURL)
        private readonly makeApiUrl: makeApiURL
    ){}

    async loadAll(params: domain.LoadAllEntriesReports.Params) {
       const response = await this.http.request({ url: this.makeApiUrl.make("reports/receipts"), method: "get", body: params });

       return { items: response } as domain.LoadAllEntriesReports.Model
    }
}

