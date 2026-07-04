import { create } from "zustand";
import api from "../../axiosInstance";
import type {
  PrenotazioneJoinPM,
  PrenotazioneModificabile,
} from "../minicomp/export_types";

interface VisiteState {
  visite: PrenotazioneJoinPM[];
  loading: boolean;
  error: string | null;
  fetchVisite: () => Promise<void>;
  completaScaduteEAggiorna: () => Promise<void>;
  annullaPrenotazione: (id: number) => Promise<void>;
  creaPrenotazione: (data: PrenotazioneModificabile) => Promise<void>;
  modificaPrenotazione: (
    id: number,
    data: PrenotazioneModificabile,
  ) => Promise<void>;
}

export const useVisiteStore = create<VisiteState>((set, get) => ({
  visite: [],
  loading: false,
  error: null,

  fetchVisite: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      const res = await api.get(`/prenotazioni/paziente/me`);
      set({ visite: res.data });
    } catch (e) {
      console.error("Errore nella ricezione dei dati degli appuntamenti:", e);
      set({ error: "Errore nel recupero delle prenotazioni" });
    } finally {
      set({ loading: false });
    }
  },

  completaScaduteEAggiorna: async () => {
    try {
      await api.patch("/prenotazioni/completa-scadute", {});
    } catch (e) {
      console.error("completaScadute:", e);
    }
    // forza refresh delle prenotazioni
    await get().fetchVisite();
  },

  creaPrenotazione: async (data: PrenotazioneModificabile) => {
    await api.post("/prenotazioni/add", { ...data, stato: "prenotata" });
    await get().fetchVisite();
  },

  annullaPrenotazione: async (id) => {
    try {
      await api.delete(`/prenotazioni/${id}`);
      await get().fetchVisite();
    } catch (e) {
      console.error("annullaPrenotazione:", e);
      set({ error: "Errore durante l'annullamento della prenotazione" });
      throw e;
    }
  },

  modificaPrenotazione: async (id, data) => {
    try {
      await api.patch(`/prenotazioni/${id}`, data);
      await get().fetchVisite();
    } catch (e) {
      console.error("modificaPrenotazione:", e);
      set({ error: "Errore durante la modifica della prenotazione" });
      throw e;
    }
  },
}));
