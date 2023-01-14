import { config } from "config";

export const fetcherCorsHeaders = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": config.API_URL,
};

export const fetcher = async <T = unknown>(
  endpoint: string,
  init?: RequestInit
): Promise<FetchResponse<T>> => {
  let url = `${config.API_URL}${endpoint}`;

  if (endpoint.includes("http")) {
    url = endpoint;
  }

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...fetcherCorsHeaders,
    },
    ...init,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new FetchError({ message: response.statusText, response, data });
  }

  return { data, status: response.status };
};

export interface FetchResponse<T = unknown> {
  data: T;
  status: number;
}

interface FetchErrorCtor {
  message: string;
  response: Response;
  data: {
    message: string;
  };
}

export class FetchError extends Error {
  response!: Response;
  data!: {
    message: string;
  };

  constructor({ message, response, data }: FetchErrorCtor) {
    super(message);

    Error.captureStackTrace?.(this, FetchError);
    this.name = "FetchError";
    this.response = response;
    this.data = data ?? { message };
  }
}
