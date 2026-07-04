import { create } from "zustand";
import type { Medico } from ".././..//react_fe/src/comp2/minicomp/export_types";
import api from "../src/axiosInstance";

interface ProfiloState {
  profiloMedico: Medico | null;
  loading: boolean;
  error: string | null;
  fetchProfiloMedico: () => Promise<void>;
  aggiornaProfiloMedico: (dati: Partial<Medico>) => Promise<void>;
  setProfiloMedico: (profilo: Medico) => void;
}

export const useProfiloStore = create<ProfiloState>((set, get) => ({
  profiloMedico: null,
  loading: false,
  error: null,

  fetchProfiloMedico: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await api.get("/medici/profilo/me");
      set({ profiloMedico: res.data });
    } catch (e) {
      console.error("fetchProfiloMedico:", e);
      set({ error: "Errore nel caricamento del profilo" });
    } finally {
      set({ loading: false });
    }
  },

  aggiornaProfiloMedico: async (dati: Partial<Medico>) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch("/medici/modifica_profilo/me", dati);
      set({ profiloMedico: res.data });
    } catch (e) {
      console.error("aggiornaProfiloMedico:", e);
      set({ error: "Errore durante il salvataggio del profilo" });
      throw e; // utile per gestire alert nel componente
    } finally {
      set({ loading: false });
    }
  },

  setProfiloMedico: (profilo: Medico) => set({ profiloMedico: profilo }),
}));
