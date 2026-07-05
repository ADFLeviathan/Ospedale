import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
});

let csrfToken: string | null = null;

async function fetchCsrfToken(): Promise<string | null> {
  const res = await api.get("/csrf");
  return res.data.csrf_token;
}

async function ensureCsrfToken(): Promise<void> {
  if (csrfToken) return;
  let token = await fetchCsrfToken();
  if (!token) {
    token = await fetchCsrfToken();
  }
  csrfToken = token;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (["post", "patch", "put", "delete"].includes(method ?? "")) {
    await ensureCsrfToken();
    if (csrfToken) {
      config.headers["x-csrftoken"] = csrfToken;
    }
  }
  return config;
});

export default api;
