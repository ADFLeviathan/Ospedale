import { create } from "zustand";
import type {  Profilo } from "../../minicomp/export_types";
import api from "../../../axiosInstance";

interface PazientiState {
  pazienti: Profilo[];
  loading: boolean;
  error: string | null;
  fetchPazienti: () => Promise<void>;
}

export const usePazientiStore = create<PazientiState>((set, get) => ({
  pazienti: [],
  loading: false,
  error: null,

  fetchPazienti: async () => {
    if (get().loading) return; // per evitare doppio fetch
    set({ loading: true, error: null });
    try {
      const res = await api.get("/pazienti/personali/me");
      set({ pazienti: res.data });
    } catch (e) {
      console.error("fetchPazienti:", e);
      set({ error: "Errore nel recupero dei pazienti" });
    } finally {
      set({ loading: false });
    }
  },
}));
