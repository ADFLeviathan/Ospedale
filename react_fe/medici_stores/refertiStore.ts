import { create } from "zustand";
import type { JoinReferto } from ".././src/comp2/minicomp/export_types";
import api from "../src/axiosInstance";

interface RefertiState {
  joinReferti: JoinReferto[];
  loading: boolean;
  error: string | null;
  fetchJoinReferti: () => Promise<void>;
}

export const useRefertiStore = create<RefertiState>((set, get) => ({
  joinReferti: [],
  loading: false,
  error: null,

  fetchJoinReferti: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await api.get(
        "/prenotazioni/join-referti/dr/me",
        
      );
      set({ joinReferti: res.data });
    } catch (e) {
      console.error("fetchJoinReferti:", e);
      set({ error: "Errore nel recupero dei referti" });
    } finally {
      set({ loading: false });
    }
  },
}));
