import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteSchedule
  implements
    domain.CloseSchedule,
    domain.ConfirmSchedule,
    domain.LoadSchedule,
    domain.CreateSchedule,
    domain.Reschedule,
    domain.PrintSchedule,
    domain.LoadAllSchedulesDashboard,
    domain.ReopenSchedule,
    domain.ChangeUpsertStatus,
    domain.DeleteSchedule
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async load(params: domain.LoadSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/${params.scheduleId}`),
      method: "get",
    });

    return response as domain.LoadSchedule.Model;
  }

  async create(params: domain.CreateSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules"),
      method: "post",
      body: params,
    });

    return response as domain.CreateSchedule.Model;
  }

  async update(params: { id: string } & domain.CreateSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules/" + params.id),
      method: "put",
      body: params,
    });

    return response as domain.CreateSchedule.Model;
  }

  async delete(params: domain.DeleteSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/${params?.id}`),
      method: "delete",
    });

    return response;
  }

  async loadAllSchedulesDashboard(
    params: domain.LoadAllSchedulesDashboard.Params
  ) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/home-2`),
      method: "get",
      body: params,
    });

    return response as domain.LoadAllSchedulesDashboard.Model;
  }


  async confirm(params: domain.ConfirmSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules/create-contact"),
      method: "post",
      body: params,
    });

    return response as domain.ConfirmSchedule.Model;
  }

  async close(params: domain.CloseSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`attendances/close/${params.idAtendimento}`),
      method: "put",
    });

    return response;
  }

  async reschedule(params: domain.Reschedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/reschedule/${params.id}`),
      method: "put",
      body: params,
    });

    return response;
  }

  async print(params: domain.PrintSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`reports/scheduling`),
      method: "get",
      body: params,
    });

    return response;
  }

  async reopen(params: domain.ReopenSchedule.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/reopen/${params?.id}`),
      method: "put",
      body: params,
    });

    return response;
  }

  async changeUpsert(params: domain.ChangeUpsertStatus.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/upsert/${params?.scheduleId}`),
      method: "put",
      body: params,
    });

    return response;
  }


}
