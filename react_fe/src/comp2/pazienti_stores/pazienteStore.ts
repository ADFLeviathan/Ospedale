import { create } from "zustand";
import axios from "axios";
import api from "../../axiosInstance";
import type { Paziente } from "../minicomp/export_types";
import { useLoginStore } from "./loginP_store";

interface PazienteState {
  paziente: Paziente | null;
  fetchPaziente: (id?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export const usePazienteStore = create<PazienteState>((set, get) => ({
  paziente: null,
  loading: false,
  error: null,

  fetchPaziente: async (id?: string) => {
    if (get().loading) {
      return;
    }
    set({ loading: true, error: null });

    try {
      const url = id ? `/pazienti/${id}` : "/pazienti/me";

      const res = await api.get(url);
      set({ paziente: res.data });
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        await useLoginStore.getState().logout();
      } else {
        console.error("Errore fetch paziente:", e);
        set({ error: "Errore nel recupero del paziente" });
      }
    } finally {
      set({ loading: false });
    }
  },
  reset: () => set({ paziente: null, loading: false, error: null }),
}));
