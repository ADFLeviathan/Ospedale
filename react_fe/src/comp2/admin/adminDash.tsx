import { useEffect } from "react";
import {
  Activity,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // npm install recharts
import type { JoinReferto } from "../minicomp/export_types";
import { useAdminDashboardStore } from "../admin/medici_stores/dashMediciStore";
import { useRefertiStore } from "./medici_stores/refertiStore";
import { usePrenotazioniStore } from "./medici_stores/prenotazioniStore";
import { usePazientiStore } from "./medici_stores/pazientiStore";

export function Admin_Dashboard() {
  const fetchPrenotazioni = usePrenotazioniStore(
    (state) => state.fetchPrenotazioni,
  );

  const visite = usePrenotazioniStore((s) => s.prenotazioni);

  const grafico = useAdminDashboardStore((state) => state.grafico);

  const visitaOggi = useAdminDashboardStore((state) => state.visitaOggi);

  const referti = useRefertiStore((state) => state.joinReferti);
  const fetchRefertiMedico = useRefertiStore((state) => state.fetchJoinReferti);

  const pazienti = usePazientiStore((state) => state.pazienti);
  const fetchPazienti = usePazientiStore((s) => s.fetchPazienti);
  const fetchCrescitaPazienti = useAdminDashboardStore(
    (s) => s.setCrescitaPazienti,
  );

  const crescitaPazienti = useAdminDashboardStore(
    (state) => state.crescitaPazienti,
  );

  const notifiche = useAdminDashboardStore((state) => state.notifiche);

  useEffect(() => {
    if (visite.length === 0) return;

    const now = new Date();
    const meseCorrente = now.getMonth();
    const annoCorrente = now.getFullYear();

    const meseScorso = meseCorrente === 0 ? 11 : meseCorrente - 1;
    const annoMeseScorso = meseCorrente === 0 ? annoCorrente - 1 : annoCorrente;

    const primePrenotazioni = new Map<string | number, Date>();

    visite.forEach((v) => {
      const dataPrenotazione = new Date(v.created_at || v.data_visita);
      const p_id = v.paziente_id;

      if (!primePrenotazioni.has(p_id)) {
        primePrenotazioni.set(p_id, dataPrenotazione);
      } else {
        if (dataPrenotazione < primePrenotazioni.get(p_id)!) {
          primePrenotazioni.set(p_id, dataPrenotazione);
        }
      }
    });

    let pazientiCorrenti = 0;
    let pazientiPrecedenti = 0;

    primePrenotazioni.forEach((dataPrimaVisita) => {
      if (
        dataPrimaVisita.getMonth() === meseCorrente &&
        dataPrimaVisita.getFullYear() === annoCorrente
      ) {
        pazientiCorrenti++;
      } else if (
        dataPrimaVisita.getMonth() === meseScorso &&
        dataPrimaVisita.getFullYear() === annoMeseScorso
      ) {
        pazientiPrecedenti++;
      }
    });

    // console.log("Nuovi pazienti questo mese:", pazientiCorrenti);
    // console.log("Nuovi pazienti mese scorso:", pazientiPrecedenti);

    let crescita: number | null = 0;

    if (pazientiPrecedenti === 0) {
      if (pazientiCorrenti === 0) {
        crescita = 0; // Nessuno prima, nessuno adesso: 0%
      } else {
        crescita = 100; // Nessuno prima, qualcuno adesso: +100%
      }
    } else {
      crescita =
        ((pazientiCorrenti - pazientiPrecedenti) / pazientiPrecedenti) * 100;
    }

    fetchCrescitaPazienti(crescita === null ? null : Math.round(crescita));
  }, [visite, fetchCrescitaPazienti]);

  useEffect(() => {
    fetchRefertiMedico();
  }, [fetchRefertiMedico]);

  useEffect(() => {
    fetchPazienti();
  }, [fetchPazienti]);

  useEffect(() => {
    fetchPrenotazioni();
  }, [fetchPrenotazioni]);

  const refertiPaziente = referti.filter(
    (item: JoinReferto) => item.referto_id !== null,
  );

  const non_aperti = refertiPaziente.filter(
    (r: JoinReferto) => r.referto_aperto === false,
  ).length;

  const prossimeVisite = visite
    .filter((p) => p.stato == "prenotata")
    .sort((a, b) => {
      const dataA = new Date(`${a.data_visita}T${a.ora_visita}`).getTime();
      const dataB = new Date(`${b.data_visita}T${b.ora_visita}`).getTime();
      return dataA - dataB;
    });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900">
          Dashboard
        </h3>
        <p className="text-gray-500 mt-1 text-sm md:text-base">
          Panoramica generale del sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-4 md:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm md:text-base">
              Pazienti Totali
            </p>
            <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-100" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold">
            {pazienti.length}
          </p>
          <p className="text-xs md:text-sm text-blue-100 mt-1">
            {crescitaPazienti === null
              ? "..."
              : `${crescitaPazienti >= 0 ? "+" : ""}${crescitaPazienti}% questo mese`}
          </p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-lg p-4 md:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-100 text-sm md:text-base">
              Appuntamenti Oggi
            </p>
            <Calendar className="w-5 h-5 md:w-6 md:h-6 text-green-100" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold">{visitaOggi}</p>
          <p className="text-xs md:text-sm text-green-100 mt-1">4 in corso</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-4 md:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-100 text-sm md:text-base">
              Referti non ancora aperti
            </p>
            <Activity className="w-5 h-5 md:w-6 md:h-6 text-purple-100" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold"> {non_aperti}</p>
          <p className="text-xs md:text-sm text-purple-100 mt-1">
            Questa settimana
          </p>
        </div>

        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-lg p-4 md:p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-orange-100 text-sm md:text-base">
              Fatturato Mensile
            </p>
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-100" />
          </div>
          <p className="text-2xl md:text-3xl font-semibold">€75k</p>
          <p className="text-xs md:text-sm text-orange-100 mt-1">
            +8.2% vs mese scorso
          </p>
        </div>
      </div>

      {/* Grafico prenotazioni */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm md:text-base">
            Trend Appuntamenti Settimanali
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={grafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#6B7280"
                style={{ fontSize: "12px" }}
                tickCount={Math.max(...grafico.map((g) => g.count)) + 2}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="count"
                fill="#3B82F6"
                name="Appuntamenti"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm md:text-base">
            Attività Recenti
          </h4>
          <div className="space-y-3 max-h-62.5 overflow-y-auto">
            {notifiche.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-700 wrap-break-word">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prossimi appuntamenti e avvisi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm md:text-base">
            Prossimi Appuntamenti
          </h4>
          <div className="space-y-3">
            {prossimeVisite.map((prenotazione) => (
              <div
                key={prenotazione.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                    {prenotazione.paziente_nome} {prenotazione.paziente_cognome}
                  </p>
                </div>
                <div className="text-right ml-2 shrink-0">
                  <p className="font-semibold text-blue-600 text-sm md:text-base">
                    {prenotazione.data_visita} {prenotazione.ora_visita}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm md:text-base">
            Avvisi e Notifiche
          </h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm md:text-base">
                  3 Referti in Attesa
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Richiedono revisione medica
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm md:text-base">
                  Promemoria Inventario
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Controllare scorte materiale sanitario
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium text-gray-900 text-sm md:text-base">
                  Sistema Aggiornato
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Tutte le funzionalità operative
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin_Dashboard;
