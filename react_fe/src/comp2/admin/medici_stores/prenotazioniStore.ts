import { create } from "zustand";
import type { JoinReferto } from "../../minicomp/export_types";
import { useAdminDashboardStore } from "./dashMediciStore";
import api from "../../../axiosInstance";

interface PrenotazioniState {
  prenotazioni: JoinReferto[];
  loading: boolean;
  error: string | null;
  fetchPrenotazioni: () => Promise<void>;
  completaScaduteEAggiorna: () => Promise<void>;
}

function formatTimeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff} sec fa`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min fa`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ore fa`;
  return `${Math.floor(diff / 86400)} giorni fa`;
}

function derivaAttivita(prenotazioni: JoinReferto[]) {
  return [...prenotazioni]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 10)
    .map((p) => {
      const nome = `${p.paziente_nome} ${p.paziente_cognome}`;
      const time = formatTimeAgo(new Date(p.updated_at));
      const visita = `${p.data_visita.split("-").reverse().join("/")} - ${p.ora_visita.slice(0, 5)}`;
      if (p.stato === "annullata") {
        return {
          id: String(p.id),
          type: "annullata",
          message: `Visita di ${nome} (${visita}) annullata`,
          time,
        };
      }
      if (p.stato === "completata") {
        return {
          id: String(p.id),
          type: "completata",
          message: `Visita di ${nome} (${visita}) completata`,
          time,
        };
      }
      return {
        id: String(p.id),
        type: "prenotata",
        message: `${nome} ha prenotato/aggiornato un appuntamento per il ${visita}.`,
        time,
      };
    });
}

//calcolo incremento pazienti mensile
// function calcolaCrescitaPazienti(prenotazioni: JoinReferto[]): number {
//   const ora = new Date();
//   const inizioMese = new Date(ora.getFullYear(), ora.getMonth(), 1);
//   const inizioMeseScorso = new Date(ora.getFullYear(), ora.getMonth() - 1, 1);

//   const idQuestoMese = new Set(
//     prenotazioni
//       .filter((p) => new Date(p.created_at) >= inizioMese)
//       .map((p) => p.paziente_id),
//   );

//   const idMeseScorso = new Set(
//     prenotazioni
//       .filter((p) => {
//         const d = new Date(p.created_at);
//         return d >= inizioMeseScorso && d < inizioMese;
//       })
//       .map((p) => p.paziente_id),
//   );

//   const qm = idQuestoMese.size;
//   const ms = idMeseScorso.size;

//   return ms === 0 ? 0 : Math.round(((qm - ms) / ms) * 100);
// }

export const usePrenotazioniStore = create<PrenotazioniState>((set, get) => ({
  prenotazioni: [],
  loading: false,
  error: null,

  fetchPrenotazioni: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const res = await api.get("/prenotazioni/dr/me");
      const prenotazioni: JoinReferto[] = res.data;

      set({ prenotazioni });

      // calcolo settimana corrente (una volta sola, fuori dal forEach)
      const giorni = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
      const counts: Record<string, number> = {
        Lun: 0,
        Mar: 0,
        Mer: 0,
        Gio: 0,
        Ven: 0,
        Sab: 0,
        Dom: 0,
      };
      const oggi = new Date();
      const oggiStr = oggi.toISOString().split("T")[0];

      const giornoSettimana = oggi.getDay() === 0 ? 6 : oggi.getDay() - 1;
      const lunedi = new Date(oggi);
      lunedi.setDate(oggi.getDate() - giornoSettimana);
      lunedi.setHours(0, 0, 0, 0);
      const domenica = new Date(lunedi);
      domenica.setDate(lunedi.getDate() + 6);
      domenica.setHours(23, 59, 59, 999);

      let conteggio_oggi = 0;
      prenotazioni.forEach((p) => {
        if (!p.data_visita) return;
        const date = new Date(p.data_visita + "T00:00:00");
        if (p.data_visita.split("T")[0] === oggiStr) conteggio_oggi++;
        if (date >= lunedi && date <= domenica) {
          const dayName = giorni[date.getDay()];
          if (counts[dayName] !== undefined) counts[dayName]++;
        }
      });

      const trendData = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(
        (day) => ({ day, count: counts[day] }),
      );

      const dash = useAdminDashboardStore.getState();
      dash.setGrafico(trendData);
      dash.setVisitaOggi(conteggio_oggi);
      dash.setNotifiche(derivaAttivita(prenotazioni));
    } catch (e) {
      console.error("fetchPrenotazioni:", e);
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
    await get().fetchPrenotazioni();
  },
}));
