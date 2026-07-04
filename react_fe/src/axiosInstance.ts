import axios from "axios";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)")); //cattura tutto quello che viene dopo = fino al ; successivo (cioè il valore)
  return match ? match[2] : null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "x-csrftoken",
});

//Interceptor: precede di ogni richiesta
api.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  if (["post", "patch", "put", "delete"].includes(method ?? "")) {
    const csrf = getCookie("csrftoken");
    if (csrf) {
      config.headers["x-csrftoken"] = csrf;
    }
  }
  return config;
});

export default api;
