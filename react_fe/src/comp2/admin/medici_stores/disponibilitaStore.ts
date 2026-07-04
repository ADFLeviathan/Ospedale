import { create } from "zustand";
import type { Disponibilita } from "../../minicomp/export_types";
import api from "../../../axiosInstance";

interface DisponibilitaState {
  disponibilita: Disponibilita[];
  loading: boolean;
  error: string | null;
  fetchDisponibilita: () => Promise<void>;
}

export const useDisponibilitaStore = create<DisponibilitaState>((set, get) => ({
  disponibilita: [],
  loading: false,
  error: null,

  fetchDisponibilita: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });

    try {
      const res = await api.get("/disp");
      set({ disponibilita: res.data });
    } catch (error) {
      console.error("fetchDisponibilita:", error);
      set({ error: "Errore nel recupero degli orari dei medici" });
    } finally {
      set({ loading: false });
    }
  },
}));
