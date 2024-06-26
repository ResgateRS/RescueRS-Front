import { useNavigate } from "react-router-dom";
import { APIResponseLogin } from "../config/define";
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
  const { token, rescuer, cellphone, setAuth } = useAuth();
  const navigate = useNavigate();

  const authHeaders = { Authorization: `Bearer ${token}` };

  const get: useApiType["get"] = async (url, options = {}) => {
    const search = options.search?.toString();

    const response = await fetch(`${url}?${search || ""}`, {
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    });
    const responseJson = await response.json();
    if (responseJson.Result === 99) {
      let reLogin = await handleReLogin();
      if (reLogin.Result === 1) {
        return await get(url, {
          ...options,
          headers: { Authorization: `Bearer ${reLogin.Data?.token}` },
        });
      }
    }
    return responseJson;
  };

  const post: useApiType["post"] = async (url, body, options = {}) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });
    const responseJson = await response.json();
    if (responseJson.Result === 99) {
      let reLogin = await handleReLogin();
      if (reLogin) {
        return await post(url, body, {
          ...options,
          headers: { Authorization: `Bearer ${reLogin.Data?.token}` },
        });
      }
    }
    return responseJson;
  };

  async function handleReLogin() {
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/Login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ cellphone, rescuer }),
    });
    const body = (await resp.json()) as APIResponseLogin;
    if (body.Result === 1) {
      setAuth(body.Data?.token, body.Data?.rescuer, cellphone);
    } else {
      setAuth(undefined, undefined, undefined);
      navigate("/");
    }
    return body;
  }

  return { get, post };
};
