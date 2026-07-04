import { Calendar, Clock, MapPin, User, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import type {
  PrenotazioneModificabile,
  PrenotazioneJoinPM,
} from "../comp2/minicomp/export_types";

//SCHEDE BOTTONI
import { SchedaPrenotazione } from "./minicomp/schedaPrenotazione";
import { SchedaEliminazione } from "./minicomp/schedaEliminazione";
//STORES
import { useVisiteStore } from "./pazienti_stores/pazientiVisite_Store";
import { usePazienteStore } from "./pazienti_stores/pazienteStore";
import { useMediciStore } from "./admin/medici_stores/medici_Store";
import { useDisponibilitaStore } from "./admin/medici_stores/disponibilitaStore";

export function PazientePrenotazioni() {
  const paziente = usePazienteStore((s) => s.paziente);
  const fetchPaziente = usePazienteStore((s) => s.fetchPaziente);

  const visite = useVisiteStore((s) => s.visite);
  const annullaPrenotazione = useVisiteStore((s) => s.annullaPrenotazione);
  const modificaPrenotazione = useVisiteStore((s) => s.modificaPrenotazione);
  const creaPrenotazione = useVisiteStore((s) => s.creaPrenotazione);
  const completaScaduteEAggiorna = useVisiteStore(
    (s) => s.completaScaduteEAggiorna,
  );
  const medici = useMediciStore((s) => s.medici);
  const fetchMedici = useMediciStore((s) => s.fetchMedici);

  const disponibilita = useDisponibilitaStore((s) => s.disponibilita);
  const fetchDisponibilita = useDisponibilitaStore((s) => s.fetchDisponibilita);

  const [mostraSchedaPrenotazione, setmostraSchedaPrenotazione] =
    useState(false);
  const [prenotazioneDaModificare, setPrenotazioneDaModificare] =
    useState<PrenotazioneJoinPM | null>(null);
  const [eliminaPrenotazione, setEliminaPrenotazione] = useState(false);
  const [filter, setFilter] = useState<"all" | "prenotata" | "completata">(
    "all",
  );
  const [prenotazioneDaEliminare, setPrenotazioneDaEliminare] =
    useState<PrenotazioneJoinPM | null>(null);

  useEffect(() => {
    completaScaduteEAggiorna();
  }, [completaScaduteEAggiorna]);

  const prenotazioniFiltrate = visite.filter((p) => {
    const stato = p.stato?.toLowerCase();

    if (filter === "all") return true;
    if (filter === "prenotata") return stato === "prenotata";
    if (filter === "completata")
      return stato === "completa" || stato === "completata";

    return true;
  });

  //dettagli paziente
  useEffect(() => {
    fetchPaziente();
  }, [fetchPaziente]);

  //recupero lista e disponibilità dei medici
  useEffect(() => {
    fetchMedici();
    fetchDisponibilita();
  }, [fetchMedici, fetchDisponibilita]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "prenotata":
        return "bg-blue-100 text-blue-700";
      case "completata":
        return "bg-green-100 text-green-700";
      case "annullata":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "prenotata":
        return "prenotata";
      case "completata":
        return "completata";
      case "annullata":
        return "annullata";
      default:
        return status;
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            I Miei Appuntamenti
          </h3>
          <p className="text-gray-500 mt-1">
            Visualizza e gestisci le tue visite
          </p>
        </div>
        <button
          onClick={() => setmostraSchedaPrenotazione(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Prenota Appuntamento
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Tutti
        </button>
        <button
          onClick={() => setFilter("prenotata")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "prenotata"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Programmati
        </button>
        <button
          onClick={() => setFilter("completata")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "completata"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Completati
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {visite.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">Nessun appuntamento prenotato</p>
            <p className="text-sm text-gray-400 mt-1">
              Clicca su "Prenota Appuntamento" per crearne uno
            </p>
          </div>
        ) : (
          prenotazioniFiltrate
            .map((visita) => ({
              ...visita,
              dateTime: new Date(`${visita.data_visita}T${visita.ora_visita}`),
            }))

            //Mostra gli appuntamenti con data e ora uguale o maggiore di adesso
            .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
            .map((prenotazione) => (
              <div
                key={prenotazione.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {prenotazione.nome_reparto}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {prenotazione.medico_nome}{" "}
                          {prenotazione.medico_cognome} -{" "}
                          {prenotazione.medico_specializzazione}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(prenotazione.stato)}`}
                      >
                        {getStatusLabel(prenotazione.stato)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-15">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(
                            prenotazione.data_visita,
                          ).toLocaleDateString("it-IT", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{prenotazione.ora_visita}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{prenotazione.note}</span>
                      </div>
                    </div>
                  </div>

                  {prenotazione.stato === "prenotata" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setPrenotazioneDaEliminare(prenotazione);
                          setmostraSchedaPrenotazione(true);
                        }}
                        className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => {
                          setPrenotazioneDaEliminare(prenotazione);
                          setEliminaPrenotazione(true);
                        }}
                        className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Cancella
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
        )}
      </div>

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
}

export default PazientePrenotazioni;
