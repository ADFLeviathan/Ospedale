import { create } from "zustand";
// import axios from "axios";
import api from "../src/axiosInstance"; // sostituisce axios, withCredentials:true e http://127.0.0.1:8000 diventano già incluse in api
import type { Paziente } from ".././..//react_fe/src/comp2/minicomp/export_types";

interface PazientiState {
  pazienti: Paziente[];
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
