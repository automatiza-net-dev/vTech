import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteBudget
  implements
  domain.CancelBudget,
  domain.CreateBudget,
  domain.ConfirmBudget,
  domain.LoadOpenNegotiations,
  domain.LoadAllBudgetsAttendance
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async loadAll(params: domain.LoadAllBudgetsAttendance.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`budgets/from-attendance/${params.id}`),
      method: "get",
    });

    return response as domain.LoadAllBudgetsAttendance.Model;
  }

  async create(params: domain.CreateBudget.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`budgets/create`),
      method: "post",
      body: params,
    });

    return response as domain.CreateBudget.Model;
  }

  async loadNegotiations(params: domain.LoadOpenNegotiations.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`budgets/open/${params.id}`),
      method: "get",
    });

    return response as domain.LoadOpenNegotiations.Model;
  }

  async cancel(params: domain.CancelBudget.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`budgets/cancel/${params.id}`),
      method: "put",
      body: params,
    });

    return response;
  }

  async confirm(params: domain.ConfirmBudget.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`budgets/confirm/${params.id}`),
      method: "put",
      body: params,
    });

    return response;
  }
}
