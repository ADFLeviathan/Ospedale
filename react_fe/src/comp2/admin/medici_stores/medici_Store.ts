import { create } from "zustand";
import type { Medico } from "../../minicomp/export_types";
import api from "../../../axiosInstance";

interface MediciState {
  medico: Medico | null;
  medici: Medico[];
  loading: boolean;
  loading_me: boolean;
  error: string | null;
  fetchMedici: () => Promise<void>;
  me: () => Promise<void>;
  reset: () => void;
}

export const useMediciStore = create<MediciState>((set, get) => ({
  medico: null,
  medici: [],
  loading: false,
  error: null,
  loading_me: false,

  fetchMedici: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await api.get("/medici");
      set({ medici: res.data });
    } catch (error) {
      console.error("Errore fetch medici:", error);
      set({ error: "Errore nel recupero dei medici" });
    } finally {
      set({ loading: false });
    }
  },
  me: async () => {
    if (get().loading_me) return;
    set({ loading_me: true, error: null });
    try {
      const res = await api.get("/medici/me");
      set({ medico: res.data });
    } catch (e) {
      console.error("Errore me (/medico/me):", e);
      set({ error: "Errore nel recupero del medico" });
    } finally {
      set({ loading_me: false });
    }
  },
  reset: () => set({ medico: null, loading_me: false, error: null }),
}));
