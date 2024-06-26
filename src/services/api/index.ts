type HTTPSuccessCodes = 200 | 201 | 202 | 203 | 204;
type HTTPErrorCodes = 400 | 401 | 403 | 404 | 409;
type HTTPServerCodes = 500 | 501 | 502 | 503 | 504 | 599;
type HTTPStatusCodes = HTTPSuccessCodes | HTTPErrorCodes | HTTPServerCodes;

export type SuccessReponse<K, D> = {
  status: Extract<HTTPSuccessCodes, K>;
  data: D;
};

export type ErrorResponse<E = {}> = {
  status: Exclude<HTTPStatusCodes, HTTPSuccessCodes>;
  data: E;
};

export type DetailedErrorResponse<DE = {}> = {
  status: HTTPErrorCodes;
  data: { error: DE };
};

export type ServerErrorResponse<SE = {}> = {
  status: HTTPServerCodes;
  data: SE;
};

import { baseURL } from '@/utils/constants/configs';

function generatUrl(endPoint: string, params?: any) {
  const queryString = new URLSearchParams(params).toString();

  return `${baseURL}/${endPoint}?${queryString}`;
}

const headers = { 'Content-Type': 'application/json' };

export const fetchData = async <T>(url: string, params: any): Promise<T> => {
  const fullURL = generatUrl(url, params);

  try {
    const response = await fetch(fullURL, { method: 'GET', headers });

    const data: T = await response.json();
    const status = response.status;

    return { data, status } as T;
  } catch (error) {
    console.log(error);

    return error as any;
  }
};

export const createData = async <T>(url: string, payload: any): Promise<T> => {
  const fullURL = generatUrl(url);
  const body = JSON.stringify(payload);

  try {
    const response = await fetch(fullURL, { method: 'POST', headers, body });

    const status = response.status;

    const data = status !== 202 && status !== 204 ? await response.json() : { code: status };

    return { data, status } as T;
  } catch (error) {
    console.log(error);
    return error as any;
  }
};

export const createData2 = async <T>(url: string, payload: any): Promise<{ data: T; status: number }> => {
  const fullURL = generatUrl(url);
  const body = JSON.stringify(payload);

  try {
    const response = await fetch(fullURL, { method: 'POST', headers, body });

    const status = response.status;

    const data: T = status !== 202 && status !== 204 ? await response.json() : { code: status };

    return { data, status };
  } catch (error) {
    console.log(error);
    return error as any;
  }
};

export const updateData = async <T>(url: string, payload: any): Promise<T> => {
  const fullURL = generatUrl(url);
  const body = JSON.stringify(payload);

  try {
    const response = await fetch(fullURL, { method: 'PUT', headers, body });

    const data: T = await response.json();
    const status = response.status;

    return { data, status } as T;
  } catch (error) {
    console.log(error);
    return error as any;
  }
};

export const deleteData = async <T>(url: string, payload: any): Promise<T> => {
  const fullURL = generatUrl(url);
  const body = JSON.stringify(payload);

  try {
    const response = await fetch(fullURL, { method: 'DELETE', headers, body });

    const data: T = await response.json();
    const status = response.status;

    return { data, status } as T;
  } catch (error) {
    console.log(error);
    return error as any;
  }
};
