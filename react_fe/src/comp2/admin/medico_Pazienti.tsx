import { Users, Phone, MapPin, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { usePazientiStore } from "./medici_stores/pazientiStore";
import { usePrenotazioniStore } from "./medici_stores/prenotazioniStore";

export function SezionePazienti() {
  const pazienti = usePazientiStore((s) => s.pazienti);
  const fetchPazienti = usePazientiStore((s) => s.fetchPazienti);
  const visite = usePrenotazioniStore((s) => s.prenotazioni);

  useEffect(() => {
    fetchPazienti();
  }, [fetchPazienti]);

  const nuoviQuestoMese = (() => {
    if (!visite || visite.length === 0) return 0;

    const now = new Date();
    const meseCorrente = now.getMonth();
    const annoCorrente = now.getFullYear();

    const primePrenotazioni = new Map<string | number, Date>();

    visite.forEach((v) => {
      const dataPrenotazione = new Date(v.created_at || v.data_visita);
      const p_id = v.paziente_id;

      if (
        !primePrenotazioni.has(p_id) ||
        dataPrenotazione < primePrenotazioni.get(p_id)!
      ) {
        primePrenotazioni.set(p_id, dataPrenotazione);
      }
    });

    let count = 0;
    primePrenotazioni.forEach((data) => {
      if (
        data.getMonth() === meseCorrente &&
        data.getFullYear() === annoCorrente
      ) {
        count++;
      }
    });
    return count;
  })();
  const visiteProgrammate =
    visite?.filter((v) => v.stato === "prenotata").length || 0;
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPatients = pazienti?.filter((patient) =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Gestione Pazienti
          </h3>
          <p className="text-gray-500 mt-1">
            Visualizza e gestisci i dati dei pazienti
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuovo Paziente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pazienti Attivi</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {pazienti?.length ?? 0}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuovi Questo Mese</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {nuoviQuestoMese}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Visite Programmate</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {visiteProgrammate}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Input di ricerca */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca per nome, ID o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients?.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">
                    {p.nome[0]}
                    {p.cognome?.[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {p.nome} {p.cognome}
                  </h4>
                  <p className="text-sm text-gray-500">{p.id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{p.numero_telefono}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{p.indirizzo}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-600">Età:</span>
                <span className="font-medium text-gray-900">
                  {calculateAge(p.data_nascita)} anni
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Ultima visita:</span>
                <span className="font-medium text-gray-900">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })
                    : "Nessun referto"}
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Edit className="w-4 h-4" />
                Modifica
              </button>
              <button className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Nuovo Paziente</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Nome e cognome"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data di Nascita
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@esempio.it"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    placeholder="+39 320 123 4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indirizzo
                </label>
                <input
                  type="text"
                  placeholder="Via, numero civico, città"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Mediche
                </label>
                <textarea
                  rows={3}
                  placeholder="Allergie, condizioni preesistenti, ecc..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Salva Paziente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SezionePazienti;
