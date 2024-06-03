import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteTutor implements domain.CreateTutor, domain.AssignTutor, domain.LoadAllPatientTutor, domain.LoadTutorOrigins, domain.SetPhone, domain.SetMainTutor {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) {}

  async loadAll(params: domain.LoadAllPatientTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patient-tutors"),
      method: "get",
      body: params,
    });

    return response as domain.LoadAllPatientTutor.Model;
  }

  async create(params: domain.CreateTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patient-tutors"),
      method: "post",
      body: params,
    });

    return response as domain.CreateTutor.Model;
  }
  
  async loadOrigins() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("client-origins"),
      method: "get",
    });

    return response as domain.LoadTutorOrigins.Model;
  }

  async assign(params: domain.AssignTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patient-tutors/assign"),
      method: "post",
      body: params,
    });

    return response as domain.AssignTutor.Model;
  }

  async setMain(params: domain.SetMainTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
        `patients/main/${params.patient}/${params.holder}`
      ),
      method: "put",
    });

    return response;
  }

  async setPhone(params: domain.SetPhone.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patients/check-phone"),
      method: "post",
      body: params,
    });

    return response as domain.SetPhone.Model;
  }
}
