import { Calendar, FileText, Clock, CheckCircle, Activity } from "lucide-react";

import type {
  JoinReferto,
  PrenotazioneJoinPM,
  PrenotazioneModificabile,
} from "../comp2/minicomp/export_types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SchedaPrenotazione } from "./minicomp/schedaPrenotazione";
import { SchedaEliminazione } from "./minicomp/schedaEliminazione";
import { useVisiteStore } from "./pazienti_stores/pazientiVisite_Store";
import { usePazienteStore } from "./pazienti_stores/pazienteStore";
import { useDisponibilitaStore } from "./admin/medici_stores/disponibilitaStore";
import { useMediciStore } from "./admin/medici_stores/medici_Store";
import { useRefertiStore } from "./admin/medici_stores/refertiStore";

const PazienteDashboard = () => {
  const paziente = usePazienteStore((s) => s.paziente);
  const fetchPaziente = usePazienteStore((s) => s.fetchPaziente);
  const visite = useVisiteStore((s) => s.visite);
  const fetchVisite = useVisiteStore((s) => s.fetchVisite);
  const completaScaduteEAggiorna = useVisiteStore(
    (s) => s.completaScaduteEAggiorna,
  );

  const referto = useRefertiStore((s) => s.joinRefertiPaziente);
  const fetchJoinRefertiPaziente = useRefertiStore(
    (s) => s.fetchJoinRefertiPaziente,
  );
  const totaleReferti = referto.length;
  const nuoviReferti = referto.filter((r) => !r.referto_aperto).length;

  //per la scheda di prenotazione
  const [prenotazioneDaModificare, setPrenotazioneDaModificare] =
    useState<PrenotazioneJoinPM | null>(null);
  const [prenotazioneDaEliminare, setPrenotazioneDaEliminare] =
    useState<PrenotazioneJoinPM | null>(null);
  const [mostraSchedaPrenotazione, setmostraSchedaPrenotazione] =
    useState(false);
  const medici = useMediciStore((s) => s.medici);
  const fetchMedici = useMediciStore((s) => s.fetchMedici);
  const annullaPrenotazione = useVisiteStore((s) => s.annullaPrenotazione);
  const modificaPrenotazione = useVisiteStore((s) => s.modificaPrenotazione);
  const creaPrenotazione = useVisiteStore((s) => s.creaPrenotazione);
  const disponibilita = useDisponibilitaStore((s) => s.disponibilita);
  const fetchDisponibilita = useDisponibilitaStore((s) => s.fetchDisponibilita);

  //per la scheda di eliminazione
  const [eliminaPrenotazione, setEliminaPrenotazione] = useState(false);

  useEffect(() => {
    completaScaduteEAggiorna();
  }, [completaScaduteEAggiorna]);

  //dettagli paziente
  useEffect(() => {
    fetchPaziente();
  }, [fetchPaziente]);

  useEffect(() => {
    if (!paziente?.id) return;

    //carica prenotazioni per paziente
    fetchVisite();
    //referti del paziente
    fetchJoinRefertiPaziente();
    fetchMedici();

    fetchDisponibilita();
  }, [
    paziente?.id,
    fetchDisponibilita,
    fetchMedici,
    fetchVisite,
    fetchJoinRefertiPaziente,
  ]);

  const getStatoSalute = (r: JoinReferto): "Ottimo" | "Buono" | "Grave" => {
    if (
      r.freq_cardiaca == null ||
      r.temperatura == null ||
      r.pressione_max == null ||
      r.pressione_min == null
    ) {
      return "Buono"; // oppure "N/A"
    }

    if (
      r.freq_cardiaca < 50 ||
      r.freq_cardiaca > 100 ||
      r.temperatura < 35.5 ||
      r.temperatura >= 38 ||
      r.pressione_max >= 140 ||
      r.pressione_min < 60
    ) {
      return "Grave";
    }

    // OTTIMO – tutti i valori ideali
    if (
      r.freq_cardiaca >= 60 &&
      r.freq_cardiaca <= 80 &&
      r.temperatura >= 36 &&
      r.temperatura <= 37.2 &&
      r.pressione_max >= 100 &&
      r.pressione_max <= 120 &&
      r.pressione_min >= 60 &&
      r.pressione_min <= 80
    ) {
      return "Ottimo";
    }

    // BUONO – tutto il resto
    return "Buono";
  };

  //data prossima prenotazione
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const ultimoReferto = [...referto].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )[0];

  const prossimoAppuntamento = visite
    .map((a) => ({
      ...a,
      dateTime: new Date(`${a.data_visita}T${a.ora_visita}`),
    }))
    .filter((a) => {
      const appointmentDate = new Date(a.dateTime);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today;
    })
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())[0];

  if (!paziente)
    return <div className="p-8 text-center text-red-500">Errore profilo</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-lg p-4 md:p-6 text-white mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-semibold mb-2">
          Benvenuto, {paziente ? `${paziente.nome}` : ""}
        </h2>
        <p className="text-blue-100 text-sm md:text-base">
          Ecco una panoramica della tua salute e dei tuoi prossimi appuntamenti
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600">
                Prossimo Appuntamento
              </p>
              <div className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                <p className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                  {prossimoAppuntamento
                    ? prossimoAppuntamento.dateTime.toLocaleDateString(
                        "it-IT",
                        {
                          day: "2-digit",
                          month: "short",
                        },
                      )
                    : "-"}
                </p>

                <p className="text-xs text-gray-500">
                  {prossimoAppuntamento
                    ? prossimoAppuntamento.dateTime.toLocaleTimeString(
                        "it-IT",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )
                    : "-"}
                </p>
              </div>
            </div>
            <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600 shrink-0 ml-2" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600">
                Referti Disponibili
              </p>
              <div className="text-lg md:text-xl font-semibold text-gray-900 mt-1">
                {nuoviReferti} nuovi
              </div>
              <p className="text-xs text-gray-500">{totaleReferti} totali</p>
            </div>
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600 shrink-0 ml-2" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600">Stato Salute</p>
              <p className="text-lg md:text-xl font-semibold">
                {ultimoReferto ? getStatoSalute(ultimoReferto) : "N/A"}
              </p>
              <p className="text-xs text-gray-500">
                Ultimo check:{" "}
                {ultimoReferto
                  ? new Date(ultimoReferto.created_at).toLocaleDateString(
                      "it-IT",
                    )
                  : "Mai"}
              </p>
            </div>
            <Activity className="w-6 h-6 md:w-8 md:h-8 text-green-600 shrink-0 ml-2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                Prossime visite
              </h3>
              <Link
                to={"/disp/dr/me"}
                className="text-xs md:text-sm text-blue-600 hover:underline"
              >
                Controlla le visite prenotate
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {visite
              .map((a) => ({
                ...a,
                dateTime: new Date(`${a.data_visita}T${a.ora_visita}`),
              }))
              .filter((a) => a.dateTime > new Date()) //Mostra gli appuntamenti con data e ora uguale o maggiore di adesso
              .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {/* {appointment.type} */}
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600 truncate">
                            {appointment.medico_nome}{" "}
                            {appointment.medico_cognome} -{" "}
                            {appointment.medico_specializzazione}
                          </p>
                        </div>
                      </div>

                      <div className="ml-0 sm:ml-13 space-y-1 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="truncate">
                            {new Date(
                              appointment.data_visita,
                            ).toLocaleDateString("it-IT", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}{" "}
                            alle {appointment.ora_visita}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 md:w-4 md:h-4 shrink-0">
                            📍
                          </span>
                          <span className="truncate">{appointment.note}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <button className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap">
                        Dettagli
                      </button>
                      <button
                        onClick={() => {
                          setmostraSchedaPrenotazione(true);
                          setPrenotazioneDaModificare(appointment);
                        }}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          setPrenotazioneDaEliminare(appointment);
                          setEliminaPrenotazione(true);
                        }}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 text-xs md:text-sm text-red-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="p-3 md:p-4 border-t border-gray-200">
            <button
              onClick={() => setmostraSchedaPrenotazione(true)}
              className="w-full py-2 text-center text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors text-sm md:text-base"
            >
              + Prenota Nuovo Appuntamento
            </button>
          </div>
        </div>

        {/* Health Metrics and Recent Reports */}
        <div className="space-y-4 md:space-y-6">
          {/* Health Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm md:text-base">
              Parametri Vitali
            </h3>

            <div className="space-y-3">
              {ultimoReferto ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-xs md:text-sm text-gray-600">
                      Parametri Vitali
                    </h1>
                    <p className="font-semibold text-gray-900 text-sm md:text-base border-b">
                      T: {ultimoReferto.temperatura}°C
                    </p>
                    <p className="font-semibold text-gray-900 text-sm md:text-base border-b">
                      Freq. cardiaca: {ultimoReferto.freq_cardiaca}
                    </p>
                    <p className="font-semibold text-gray-900 text-sm md:text-base border-b">
                      Pressione min:{ultimoReferto.pressione_min} - max:{" "}
                      {ultimoReferto.pressione_max}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(ultimoReferto.created_at).toLocaleDateString(
                        "it-IT",
                      )}
                    </p>
                  </div>
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 shrink-0 ml-2" />
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  Nessun parametro vitale disponibile
                </div>
              )}
            </div>
          </div>

          {/* Recent Reports */}

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                Referti Recenti
              </h3>
              <Link
                to={"/prenotazioni/join-referti/paziente/me"}
                className="text-xs md:text-sm text-blue-600 hover:underline"
              >
                Vedi i tuoi referti
              </Link>
            </div>
            <div className="space-y-3">
              {referto && referto.length > 0 ? (
                referto.map((report, index) => (
                  <div
                    key={index}
                    className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm md:text-base truncate">
                          Referto - Pressione: {report.pressione_min}/
                          {report.pressione_max}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Medico: {report.medico_nome} {report.medico_cognome}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {report.referto_note || "Nessuna nota"}
                        </p>
                      </div>
                      {report.referto_aperto ? (
                        <span className="px-2 py-1 text-xs font-medium text-back bg-gray-100 rounded-full whitespace-nowrap">
                          Aperto
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full whitespace-nowrap">
                          Da aprire
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                  Nessun referto disponibile
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-lg p-4 md:p-6 text-white">
            <h3 className="font-semibold mb-2 text-sm md:text-base">
              Hai bisogno di aiuto?
            </h3>
            <p className="text-xs md:text-sm text-purple-100 mb-4">
              Contatta il nostro supporto per qualsiasi domanda
            </p>
            <button className="w-full py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-colors text-sm md:text-base">
              Contatta Supporto
            </button>
          </div>
        </div>
      </div>

      {/* modifica */}
      <SchedaPrenotazione
        key={prenotazioneDaModificare?.id ?? "new"}
        aperto={mostraSchedaPrenotazione}
        medici={medici}
        disponibilita={disponibilita}
        prenotazione={prenotazioneDaModificare}
        onClose={() => {
          setmostraSchedaPrenotazione(false);
          setPrenotazioneDaModificare(null);
        }}
        onConfirm={async (data) => {
          if (!paziente?.id) return;

          const daModificare = prenotazioneDaModificare;

          const payload: PrenotazioneModificabile = {
            medico_id: data.medico_id,
            paziente_id: paziente.id,
            reparto_id: 1,
            data_visita: data.data_visita,
            ora_visita: data.ora_visita,
            note: data.note,
          };

          if (daModificare) {
            await modificaPrenotazione(daModificare.id, payload);
            await fetchJoinRefertiPaziente();
          } else {
            await creaPrenotazione(payload);
          }
          setmostraSchedaPrenotazione(false);
          setPrenotazioneDaModificare(null);
        }}
      />

      <SchedaEliminazione
        aperto={eliminaPrenotazione}
        prenotazione={prenotazioneDaEliminare}
        onClose={() => setEliminaPrenotazione(false)}
        onConfirm={async () => {
          if (!prenotazioneDaEliminare) return;
          try {
            await annullaPrenotazione(prenotazioneDaEliminare.id);
            await fetchJoinRefertiPaziente();
            alert("Prenotazione eliminata!");
            setEliminaPrenotazione(false);
            setPrenotazioneDaEliminare(null);
          } catch {
            alert("Errore durante l'eliminazione. Riprova.");
          }
        }}
      />
    </div>
  );
};

export default PazienteDashboard;
