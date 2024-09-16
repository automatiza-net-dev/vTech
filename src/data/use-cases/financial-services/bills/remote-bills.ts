import { inject, injectable } from "inversify";

import { InfraTypes } from "@/container/infra/types";
import { makeApiURL } from "@/container/infra/make-api-url";

import * as domain from "@/domain";

@injectable()
export class RemoteBills
  implements
    domain.LoadBill,
    domain.CreateBill,
    domain.PrintDocument,
    domain.LoadBillPaymentReceipts,
    domain.UpdateFinancialResponsible
{
  constructor(
    @inject(InfraTypes.makeApiURL) private readonly makeApiURL: makeApiURL,
    @inject(InfraTypes.authorizeDashboardHttp)
    private readonly httpClient: domain.HttpClient
  ) {}

  async create(params: domain.CreateBill.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`bills/create`),
      method: "post",
      body: params,
    });

    return response as domain.CreateBill.Model;
  }

  async update(params: domain.UpdateBill.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(`bills/update`),
      method: "post",
      body: params,
    });

    return response as domain.UpdateBill.Model;
  }

  async load(params: domain.LoadBill.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
        `bills/show/${params.id}`
      ),
      method: "get",
    });

    return response as domain.LoadBill.Model;
  }

  async loadBillReceipts(params: domain.LoadBillPaymentReceipts.Params) {
    const response = await this.httpClient.request({
      url: this.makeApiURL.make(
        `bills/print-payment-receipts/${params.billId}`
      ),
      method: "get",
      body: params,
    });

    return response as domain.LoadBillPaymentReceipts.Model;
  }

  async printDocument(params: domain.PrintDocument.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make(`product-documents/print`),
      method: "post",
      body: params,
    });
  }

  async updateFinancialResponsible(
    params: domain.UpdateFinancialResponsible.Params
  ) {
    await this.httpClient.request({
      url: this.makeApiURL.make(`bills/financial-responsible`),
      method: "put",
      body: params,
    });

    return {};
  }

  async deleteBillItem(params: domain.DeleteBillItem.Params) {
    await this.httpClient.request({
      url: this.makeApiURL.make(`bills/delete-item/${params.id}`),
      method: "put",
    });
  }

  async authDiscountPendencySellingBill(
    params: domain.AuthDiscountPendencySellingBill.Params
  ) {
    await this.httpClient.request({
      url: this.makeApiURL.make(`bills/approve`),
      method: "post",
      body: params,
    });

    return {};
  }
}
