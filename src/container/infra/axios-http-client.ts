import { injectable } from 'inversify'

import axios, { AxiosRequestConfig } from 'axios'
import { HttpClient, HttpRequest, HttpStatusCode } from '@/domain'
import { BadRequestError,  HttpResponse, UnauthorizedError, ValidationError } from 'infinity-forge'



@injectable()
export class AxiosHttpClient implements HttpClient {
  async request(payload: HttpRequest): Promise<HttpResponse> {
    const method = payload.method

    const newBody = payload.body
      ? Object.fromEntries(Object.entries(payload.body).filter(([_, value]) => value !== ''))
      : undefined

    const requestPayload = {
      ...payload,
      data: method !== 'get' && method !== 'delete' && newBody,
      params: (method === 'get' || method === 'delete') && newBody,
      headers: { timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, ...(payload.headers || {}) },
    } as AxiosRequestConfig<{
      [k: string]: unknown;
  }>

    const contentType = requestPayload.headers && requestPayload.headers['Content-Type']

    const { status, data } =
      (payload.method === 'post' || payload.method === "put") && contentType === 'multipart/form-data; boundary=something'
        ? await axios[payload.method](requestPayload?.url || "", payload.body, { headers: requestPayload.headers })
            .then((r) => {
              return r
            })
            .catch((error) => {
              if (!error?.response) {
                return {
                  status: '500',
                  data: { message: 'An unexpected error occurred' },
                }
              }

              return {
                data: error?.response?.data,
                status: error?.response?.status,
              }
            })
        : await axios
            .request(requestPayload)
            .then((r) => {
              return r
            })
            .catch((error) => {
              if (!error?.response) {
                return {
                  status: '500',
                  data: { message: 'An unexpected error occurred' },
                }
              }

              return {
                data: error?.response?.data,
                status: error?.response?.status,
              }
            })

    switch (status) {
      case HttpStatusCode.ok:
        return data

      case HttpStatusCode.okNoContent:
        return data

      case HttpStatusCode.okPost:
        return data

      case HttpStatusCode.okCreated:
        return data

      case HttpStatusCode.unauthorized: {
        throw new UnauthorizedError({ code: '401', message: '' })
      }

      case HttpStatusCode.unprocessableEntity:
        throw new ValidationError(data.validationErrors)

      case HttpStatusCode.badRequest:
        throw new BadRequestError({ message: data.message, code: '400' })

      default: {
        throw new BadRequestError({ message: 'Internal Server Error - ' + requestPayload.url, code: '500' })
      }
    }
  }
}