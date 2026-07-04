import { create } from "zustand";
import axios from "axios";
import api from "../../axiosInstance";
import { usePazienteStore } from "./pazienteStore";
import { useMediciStore } from "../admin/medici_stores/medici_Store";

export type Role = "admin" | "patient" | null;

interface LoginState {
  role: Role;
  loading: boolean;
  loadingCheck: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<Role>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: () => boolean;
}

export const useLoginStore = create<LoginState>((set, get) => ({
  role: null,
  loading: false,
  loadingCheck: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      await api.get("/csrf");
      const res = await api.post("/login", {
        username,
        password,
      });

      console.log("Risposta server:", res.data);

      const { role } = res.data;
      if (!res.data.role) {
        alert("Errore, non c'è il ruolo!");
        throw new Error("Ruolo mancante");
      }
      set({ role, loading: false });
      return role;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Dettagli errore:", err.response?.data);
      }
      set({ error: "Username o password errati", loading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post("/logout", {});
    } catch (e) {
      console.error("Errore logout:", e);
    } finally {
      usePazienteStore.getState().reset();
      useMediciStore.getState().reset();

      set({ role: null });
    }
  },

  isAuthenticated: () => {
    return get().role !== null;
  },
  checkAuth: async () => {
    set({ loadingCheck: true });
    try {
      const res = await api.get("/me");

      set({ role: res.data.role, loadingCheck: false });
    } catch {
      set({ role: null, loadingCheck: false });
    }
  },
}));
