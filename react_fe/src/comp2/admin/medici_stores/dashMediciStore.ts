import { create } from "zustand";
import type { JoinReferto } from "../../minicomp/export_types";

interface AdminDashboardState {
  visite: JoinReferto[];
  grafico: { day: string; count: number }[];
  visitaOggi: number;
  referti: number;
  pazienti: number;
  crescitaPazienti: number | null;
  notifiche: { id: string; type: string; message: string; time: string }[];

  setVisite: (v: JoinReferto[]) => void;
  setGrafico: (g: { day: string; count: number }[]) => void;
  setVisitaOggi: (v: number) => void;
  setReferti: (r: number) => void;
  setPazienti: (p: number) => void;
  setCrescitaPazienti: (c: number | null) => void;
  setNotifiche: (
    n: { id: string; type: string; message: string; time: string }[],
  ) => void;
}

// create riceve una callback che ha accesso a set — l'unica funzione che puoi usare per aggiornare lo stato.
// Quello che restituisce la callback è l'stato iniziale + le azioni, tutto nello stesso oggetto.
export const useAdminDashboardStore = create<AdminDashboardState>((set) => ({
  visite: [],
  grafico: [],
  visitaOggi: 0,
  referti: 0,
  pazienti: 0,
  crescitaPazienti: null,
  notifiche: [],
  setVisite: (visite) => set({ visite }),
  setGrafico: (grafico) => set({ grafico }),
  setVisitaOggi: (visitaOggi) => set({ visitaOggi }),
  setReferti: (referti) => set({ referti }),
  setPazienti: (pazienti) => set({ pazienti }),
  setCrescitaPazienti: (crescitaPazienti) => {
    // console.log("setCrescitaPazienti chiamata con:", crescitaPazienti);
    set({ crescitaPazienti });
  },
  setNotifiche: (notifiche) => set({ notifiche }),
}));
