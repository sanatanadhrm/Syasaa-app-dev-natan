import Cookies from "js-cookie";

const fetchAbsolute = (fetch: any, baseUrl: any, content?: string) => {
  return async (url: string, ...params: any) => {
    const defaultOptions = {
      credentials: "include",
      headers: {
        Accept: content || "application/json",
        "Content-Type": content || "application/json",
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") || "",
      },
    };

    const [input, options = {}] = params;
    const finalOptions = { ...defaultOptions, ...options };

    if (url.startsWith('/')) {
      return await fetch(baseUrl + url, { ...finalOptions, ...input });
    } else {
      return await fetch(url, { ...finalOptions, ...input });
    }
  }
}

let fetchAPI = fetchAbsolute(fetch, import.meta.env.VITE_API_URL);
export default fetchAPI;
