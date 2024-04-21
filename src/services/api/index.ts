import { baseURL } from "@/utils/constants/configs";

function generatUrl(endPoint: string, params?: any) {
  const queryString = new URLSearchParams(params).toString();

  return `${baseURL}/${endPoint}?${queryString}`;
}

export const fetchData = async (url: string, params: any) => {
  const fullURL = generatUrl(url, params);
  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(fullURL, {
      method: "GET",
      headers,
      cache: "no-cache",
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);

    return error;
  }
};

export const createData = async (url: string, payload: any) => {
  const fullURL = generatUrl(url);

  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(fullURL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const updateData = async (url: string, payload: any) => {
  const fullURL = generatUrl(url);

  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(fullURL, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const deleteData = async (url: string, params: any) => {
  const fullURL = generatUrl(url, params);

  const headers = { "Content-Type": "application/json" };

  try {
    const response = await fetch(fullURL, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
