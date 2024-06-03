import axios, { AxiosResponse } from "axios";

import { HttpRequest, HttpClient } from "@/domain";
import { injectable } from "inversify";

@injectable()
export class AxiosHttpClient implements HttpClient {
  async request(data: HttpRequest): Promise<any> {
    try {
      const method = data.method;

      const newBody = data.body ? Object.fromEntries(
        Object.entries(data.body).filter(([_, value]) => value !== "")
      ) : undefined;

      const requestPayload = {
        ...data,
        data: method !== "get" && newBody,
        params: method === "get" && newBody,
      };
      const axiosResponse: AxiosResponse = await axios.request(requestPayload);

      return {
        body: axiosResponse.data,
        statusCode: axiosResponse.status,
      };
    } catch (error: any) {
      if (!error.response) {
        console.error("An unexpected error occurred:", error);

        return {
          statusCode: 500,
          body: { message: "An unexpected error occurred" },
        };
      }

      return {
        statusCode: error.response.status,
        body: error.response.data,
      };
    }
  }
}