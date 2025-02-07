import { injectable } from 'inversify'

import axios, { AxiosRequestConfig } from 'axios'
import { HttpClient, HttpRequest, HttpStatusCode } from '@/domain'
import { api, BadRequestError,  HttpResponse, UnauthorizedError, ValidationError } from 'infinity-forge'

@injectable()
export class AxiosHttpClient implements HttpClient {
  async request(payload: HttpRequest): Promise<HttpResponse> {
    return api(payload, "")
  }
}