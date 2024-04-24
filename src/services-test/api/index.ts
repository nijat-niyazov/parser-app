import { baseURL } from '@/utils/constants/configs';

function generatUrl(endPoint: string, params?: any) {
  const queryString = new URLSearchParams(params).toString();

  return `${baseURL}/${endPoint}?${queryString}`;
}

export const fetchData = async <T>(url: string, params: any): Promise<{ status: number; data: T }> => {
  const fullURL = generatUrl(url);

  const headers = {
    'Content-Type': 'application/json',
    // 'Transfer-Encoding': 'chunked',
    // Date: 'Wed, 24 Apr 2024 20:35:57 GMT',
    // 'Keep-Alive': 'timeout=60',
    // Connection: 'keep-alive',
  };

  console.log(fullURL);

  try {
    const response = await fetch(fullURL, {
      method: 'GET',
      headers,
    });

    const data: T = await response.json();
    const status = response.status;

    return { data, status };
  } catch (error) {
    console.log(error);

    return error as any;
  }
};

export const createData = async <T>(url: string, payload: any): Promise<{ data: T; status: number }> => {
  const fullURL = generatUrl(url);

  const headers = { 'Content-Type': 'application/json' };

  const body = JSON.stringify(payload);

  try {
    const response = await fetch(fullURL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data: T = await response.json();
    const status = response.status;

    return { data, status };
  } catch (error) {
    console.log(error);
    return error as any;
  }
};

export const updateData = async <T>(url: string, payload: any): Promise<{ data: T; status: number }> => {
  const fullURL = generatUrl(url);

  const headers = { 'Content-Type': 'application/json' };

  try {
    const response = await fetch(fullURL, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });

    const data: T = await response.json();
    const status = response.status;

    return { data, status };
  } catch (error) {
    console.log(error);
    return error as any;
  }
};

export const deleteData = async <T>(url: string, payload: any): Promise<{ data: T; status: number }> => {
  const fullURL = generatUrl(url);

  const headers = { 'Content-Type': 'application/json' };

  try {
    const response = await fetch(fullURL, {
      method: 'DELETE',
      headers,
      body: JSON.stringify(payload),
    });

    const data: T = await response.json();
    const status = response.status;

    return { data, status };
  } catch (error) {
    console.log(error);
    return error as any;
  }
};
