import { Calendar, Clock, User, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePrenotazioniStore } from "./medici_stores/prenotazioniStore";

export function SezionePrenotazioni() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );

  const [searchTerm, setSearchTerm] = useState("");

  const prenotazioni = usePrenotazioniStore((state) => state.prenotazioni);
  const completaScaduteEAggiorna = usePrenotazioniStore(
    (state) => state.completaScaduteEAggiorna,
  );

  useEffect(() => {
    completaScaduteEAggiorna();
  }, [completaScaduteEAggiorna]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "prenotata":
        return "bg-blue-100 text-blue-700";
      case "completata":
        return "bg-green-100 text-green-700";
      case "annullata":
        return "bg-red-100 text-red-700";
      case "in-corso":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "prenotata":
        return "Programmata";
      case "completata":
        return "Completata";
      case "annullata":
        return "Cancellata";
      case "in-corso":
        return "In Corso";
      default:
        return status;
    }
  };


  const filteredAppointments = prenotazioni.filter((apt) => {
    // Estrai la data in formato YYYY-MM-DD
    let dataVisita = "";
    if (apt.data_visita) {
      const dateStr = apt.data_visita.toString();
      // Se contiene "T", prendi la parte prima di T (per ISO format)
      dataVisita = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
    }

    const matchDate = !dataVisita || dataVisita === selectedDate;
    const matchSearch =
      searchTerm === "" ||
      apt.paziente_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.paziente_cognome?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchDate && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Prenotazioni
          </h3>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Gestisci gli appuntamenti dei pazienti
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Calendario */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
          <h4 className="font-semibold mb-4 text-sm md:text-base">
            Calendario
          </h4>
          <div className="space-y-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />

            <div className="mt-4 md:mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    Oggi
                  </p>
                  <p className="text-xl md:text-2xl font-semibold text-blue-600">
                    {filteredAppointments.length}
                  </p>
                  <p className="text-xs text-gray-500">appuntamenti</p>
                </div>
                <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    Completate
                  </p>
                  <p className="text-xl md:text-2xl font-semibold text-green-600">
                    {
                      prenotazioni.filter((a) => a.stato === "completata")
                        .length
                    }
                  </p>
                  <p className="text-xs text-gray-500">questa settimana</p>
                </div>
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-3">
              <h4 className="font-semibold text-sm md:text-base">
                Appuntamenti -{" "}
                {new Date(selectedDate).toLocaleDateString("it-IT", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h4>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Cerca paziente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 max-h-125 md:max-h-150 overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <div className="p-6 md:p-8 text-center text-gray-500 text-sm md:text-base">
                Nessun appuntamento per questa data
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                        <h5 className="font-semibold text-gray-900 text-sm md:text-base">
                          {appointment.paziente_nome}{" "}
                          {appointment.paziente_cognome}
                        </h5>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(appointment.stato)}`}
                        >
                          {getStatusLabel(appointment.stato)}
                        </span>
                      </div>

                      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="truncate">
                            Dr. {appointment.medico_nome}{" "}
                            {appointment.medico_cognome}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="truncate">
                            {appointment.ora_visita}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                          <span className="truncate">
                            {appointment.nome_reparto}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 self-end sm:self-auto">
                      <button className="px-3 py-1 text-xs md:text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap">
                        Modifica
                      </button>
                      <button className="px-3 py-1 text-xs md:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap">
                        Cancella
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default SezionePrenotazioni;
