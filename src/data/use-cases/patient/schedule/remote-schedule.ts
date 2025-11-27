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
    domain.DeleteSchedule,
    domain.LoadSyncableScheduleExecutions,
    domain.LoadAllReturnableEvents,
    domain.LoadScheduleIdMock,
    domain.LoadAllSynchedTreatmentItems
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
      url: this.makeApiURL.make(`schedules/exclude`),
      method: "put",
      body: params,
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

  async loadSyncableExecutions(
    params: domain.LoadSyncableScheduleExecutions.Params
  ) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
        `treatments/search-syncheable-schedule-executions/${params?.idPaciente}`
      ),
      method: "get",
      body: params,
    });

    return response as domain.LoadSyncableScheduleExecutions.Model;
  }

  async loadAllReturnableEvents(params: domain.LoadAllReturnableEvents.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("schedules/search-events"),
      method: "get",
      body: params,
    });

    return response;
  }

  async loadScheduleIdMock(params: domain.LoadScheduleIdMock.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`schedules/schedules-attendances/${params.id}`),
      method: "get",
    });

    return response as domain.LoadScheduleIdMock.Model;
  }

  async loadSynchedTreatmentItems(
    params: domain.LoadSynchedTreatmentItems.Params
  ) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
        `treatments/schedules-treatment-executions/${params.eventId}`
      ),
      method: "get",
    });

    return response as domain.LoadSynchedTreatmentItems.Model;
  }
}
