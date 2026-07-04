import { create } from "zustand";
import type { JoinReferto } from "../../minicomp/export_types";
import api from "../../../axiosInstance";

interface RefertiState {
  joinReferti: JoinReferto[];
  joinRefertiPaziente: JoinReferto[];
  loadingM: boolean;
  loadingP: boolean;
  error: string | null;
  fetchJoinReferti: () => Promise<void>;
  fetchJoinRefertiPaziente: () => Promise<void>;
  contrassegnaComeAperto: (id: number) => Promise<void>;
}

export const useRefertiStore = create<RefertiState>((set, get) => ({
  joinReferti: [],
  joinRefertiPaziente: [],
  loadingM: false,
  loadingP: false,
  error: null,

  fetchJoinReferti: async () => {
    if (get().loadingM) return;
    set({ loadingM: true, error: null });
    try {
      const res = await api.get(
        "/prenotazioni/join-referti/dr/me",
        
      );
      set({ joinReferti: res.data });
    } catch (e) {
      console.error("fetchJoinReferti:", e);
      set({ error: "Errore nel recupero dei referti del medico" });
    } finally {
      set({ loadingM: false });
    }
  },

  fetchJoinRefertiPaziente: async () => {
    if (get().loadingP) return;
    set({ loadingP: true, error: null });
    try {
      const res = await api.get(
        "/prenotazioni/join-referti/paziente/me",
        
      );
      const referti: JoinReferto[] = res.data.filter(
        (r: JoinReferto) => r.referto_id !== null,
      );
      set({ joinRefertiPaziente: referti });
      // console.log(res.data);
    } catch (e) {
      console.error("fetchJoinRefertiPaziente:", e);
      set({ error: "Errore nel recupero dei referti del paziente" });
    } finally {
      set({ loadingP: false });
    }
  },
  contrassegnaComeAperto: async (id) => {
    try {
      await api.patch(
        `/referti/modifica_referto/${id}`,
        {},
        
      );

      set((state) => ({
        joinReferti: state.joinReferti.map((r) =>
          r.referto_id === id ? { ...r, referto_aperto: true } : r,
        ),
        joinRefertiPaziente: state.joinRefertiPaziente.map((r) =>
          r.referto_id === id ? { ...r, referto_aperto: true } : r,
        ),
      }));
    } catch (e) {
      console.error("contrassegnaComeAperto:", e);
    }
  },
}));
