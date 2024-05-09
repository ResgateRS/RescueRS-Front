import { useAuth } from "../context/AuthContext";

type RequestOptions = {
  search?: URLSearchParams;
  headers?: Record<string, string>;
};

type useApiType = {
  get: <R = unknown>(url: string, options?: RequestOptions) => Promise<R>;
  post: <P = unknown, R = unknown>(
    url: string,
    body: P,
    options?: RequestOptions,
  ) => Promise<R>;
};

export const useApi = () => {
  const { token } = useAuth();

  const authHeaders = { Authorization: `Bearer ${token}` };

  const get: useApiType["get"] = async (url, options = {}) => {
    const search = options.search?.toString();

    const response = await fetch(`${url}?${search || ""}`, {
      headers: {
        ...options.headers,
        ...authHeaders,
      },
    });
    return await response.json();
  };

  const post: useApiType["post"] = async (url, body, options = {}) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...options.headers,
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  };

  return { get, post };
};
