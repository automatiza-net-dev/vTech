import { inject, injectable } from "inversify";

import * as domain from "@/domain";
import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

@injectable()
export class RemoteCRM
  implements
    domain.SyncSchedule,
    domain.LoadDashboardCRM,
    domain.LoadOpportunitiesReport,
    domain.LoadAllOpportunitiesSchedule
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async loadAll(params: domain.LoadAllOpportunitiesSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`opportunities/search-syncable-opportunities`),
      method: "get",
      body: params,
    });

    return response as domain.LoadAllOpportunitiesSchedule.Model;
  }

  async sync(params: domain.SyncSchedule.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make(`opportunities/sync-schedule`),
      method: "post",
      body: params,
    });

    return {};
  }

  async loadOpportunitiesReport(params: domain.LoadOpportunitiesReport.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`reports/crm-opportunities`),
      method: "get",
      body: params,
    });

    return response as domain.LoadOpportunitiesReport.Model;
  }

  async loadDashboardCRM(params: domain.LoadDashboardCRM.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("dashboard-crm"),
      method: "get",
      body: params,
    });

    return response as domain.LoadDashboardCRM.Model;
  }
}
