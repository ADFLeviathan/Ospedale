import { create } from "zustand";
import type { Prenotazione } from ".././..//react_fe/src/comp2/minicomp/export_types";
import api from "../src/axiosInstance";

interface PrenotazioniState {
  prenotazioni: Prenotazione[];
  loading: boolean;
  error: string | null;
  fetchPrenotazioni: () => Promise<void>;
  completaScaduteEAggiorna: () => Promise<void>;
}

export const usePrenotazioniStore = create<PrenotazioniState>((set, get) => ({
  prenotazioni: [],
  loading: false,
  error: null,

  fetchPrenotazioni: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await api.get("http://127.0.0.1:8000/prenotazioni/dr/me");
      set({ prenotazioni: res.data });
    } catch (e) {
      console.error("fetchPrenotazioni:", e);
      set({ error: "Errore nel recupero delle prenotazioni" });
    } finally {
      set({ loading: false });
    }
  },

  completaScaduteEAggiorna: async () => {
    try {
      await api.patch(
        "http://127.0.0.1:8000/prenotazioni/completa-scadute",
        {},
      );
    } catch (e) {
      console.error("completaScadute:", e);
    }
    // forza refresh delle prenotazioni
    await get().fetchPrenotazioni();
  },
}));
