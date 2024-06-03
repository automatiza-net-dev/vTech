import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemotePatient implements domain.LoadPatient, domain.LoadBeds, domain.CreateHospitalization, domain.LoadAllVaccines, domain.LoadLastUpdates, domain.ChangeWeight {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}
  async load(params: domain.LoadPatient.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`patients/display/${params?.patientId}`),
      method: "get",
    });

    return response as domain.LoadPatient.Model;
  }

  async loadBeds(params: domain.LoadBeds.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`beds`),
      method: "get",
      body: params
    });

    return response as domain.LoadBeds.Model;
  }

  async createHospitalization(params: domain.CreateHospitalization.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("hospitalizations"),
      method: "post",
      body: params
    });

    return response;
  }

  async loadAllVaccines(params: domain.LoadAllVaccines.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patient-vaccines"),
      method: "get",
      body: params,
    });

    return response as domain.LoadAllVaccines.Model;
  }

  async loadLastUpdates(params: domain.LoadLastUpdates.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`n-timeline/${params.id}`),
      method: "get",
    });

    return response as domain.LoadLastUpdates.Model;
  }

  async changeWeight(params: domain.ChangeWeight.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`n-timeline/weight`),
      method: "post",
      body: params
    });

    return response
  }
}
