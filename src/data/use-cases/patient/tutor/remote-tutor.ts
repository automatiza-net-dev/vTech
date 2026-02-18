import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteTutor
  implements
  domain.SetPhone,
  domain.CreateTutor,
  domain.AssignTutor,
  domain.SetMainTutor,
  domain.CreateContact,
  domain.LoadTutorOrigins,
  domain.LoadAllProfessions,
  domain.LoadAllPatientTutor,
  domain.LoadTutor,
  domain.EditTutor {
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient<any>
  ) { }

  async unlink(params: domain.UnlinkPetTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`patients/unlink`),
      method: "put",
      body: params,
    });

    return response as domain.UnlinkPetTutor.Model;
  }

  async load(params: domain.LoadTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`patient-tutors/display/${params.id}`),
      method: "get",
    });

    return response as domain.LoadTutor.Model;
  }

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
      url: this.makeApiURL.make(`patient-tutors`),
      method: "post",
      body: params,
      headers: {
        "Content-Type": "multipart/form-data; boundary=something",
      },
    });

    return response as domain.CreateTutor.Model;
  }

  async update(params: domain.EditTutor.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`patient-tutors/${params instanceof FormData ? params.get('id') : params.id}`),
      method: "put",
      body: params,
      headers: params instanceof FormData ? {
        "Content-Type": "multipart/form-data; boundary=something",
      } : undefined,
    });

    return response as domain.EditTutor.Model;
  }

  async loadOrigins(params = {}) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("client-origins"),
      method: "get",
      body: params 
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

  async loadAllProfessions() {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("professions"),
      method: "get",
    });

    return response as domain.LoadAllProfessions.Model;
  }

  async createContact(params: domain.CreateContact.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make("patient-contacts/batch"),
      method: "post",
      body: params,
    });

    return response;
  }
}
