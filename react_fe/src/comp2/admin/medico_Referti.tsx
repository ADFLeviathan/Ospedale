import {
  FileText,
  Download,
  Eye,
  Upload,
  Search,
  Filter,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { JoinReferto } from "../minicomp/export_types";
import { SchedaReferto } from "../minicomp/mostraReferto";
import { useRefertiStore } from "./medici_stores/refertiStore";

export function SezioneReferti() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const joinreferto = useRefertiStore((state) => state.joinReferti);
  const fetchJoinReferti = useRefertiStore((state) => state.fetchJoinReferti);
  const [refertiSelezionati, setRefertiSelezionati] =
    useState<JoinReferto | null>(null);

  useEffect(() => {
    fetchJoinReferti();
  }, [fetchJoinReferti]);

  const getStatusColor = (stato: string) => {
    switch (stato) {
      case "completata":
        return "bg-green-100 text-green-700";
      case "prenotata":
        return "bg-yellow-100 text-yellow-700";
      case "annullata":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (stato: string) => {
    switch (stato) {
      case "available":
        return "Disponibile";
      case "pending":
        return "In Attesa";
      case "reviewed":
        return "Revisionato";
      default:
        return stato;
    }
  };

  const referti_filtrati = joinreferto.filter(
    (referto) =>
      referto.paziente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referto.paziente_cognome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">
            Gestione Referti
          </h3>
          <p className="text-gray-500 mt-1 text-sm md:text-base">
            Carica e visualizza i referti medici
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          <Upload className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Carica Referto</span>
          <span className="sm:hidden">Carica</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Totale Referti</p>
              <p className="text-xl md:text-2xl font-semibold text-gray-900 mt-1">
                {joinreferto.length}
              </p>
            </div>
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600 shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Disponibili</p>
              <p className="text-xl md:text-2xl font-semibold text-green-600 mt-1">
                {joinreferto.filter((r) => r.stato === "prenotata").length}
              </p>
            </div>
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-green-600 shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">In Attesa</p>
              <p className="text-xl md:text-2xl font-semibold text-yellow-600 mt-1">
                {joinreferto.filter((r) => r.stato === "prenotata").length}
              </p>
            </div>
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-yellow-600 shrink-0" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-600">Revisionati</p>
              <p className="text-xl md:text-2xl font-semibold text-blue-600 mt-1">
                {joinreferto.filter((r) => r.stato === "completata").length}
              </p>
            </div>
            <FileText className="w-6 h-6 md:w-8 md:h-8 text-blue-600 shrink-0" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per paziente, tipo di referto o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
            <Filter className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            Filtri
          </button>
        </div>
      </div>

      {/* joinreferto Table/Cards - Responsive */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paziente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Apri
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {referti_filtrati.map((report) => (
                <tr
                  key={report.referto_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* nome e cognome paziente*/}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">
                        {report.paziente_nome} {report.paziente_cognome}
                      </div>
                      <div className="text-sm text-gray-500"></div>
                    </div>
                  </td>
                  {/* nome e cognome medico */}
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Dr. {report.medico_nome} {report.medico_cognome}
                      </div>
                    </div>
                  </td>
                  {/* data visita */}
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {new Date(report.data_visita).toLocaleDateString("it-IT")}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.referto_note}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.stato)}`}
                    >
                      {getStatusLabel(report.stato)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Visualizza"
                        onClick={() => setRefertiSelezionati(report)}
                      >
                        <Eye className="w-4 h-4 text-blue-600" />
                      </button>
                      {/* <button
                        className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                        title="Scarica"
                      >
                        <Download className="w-4 h-4 text-green-600" />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-gray-200">
          {referti_filtrati.map((report) => (
            <div
              key={report.referto_id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                    {report.paziente_nome}
                  </h4>
                  <p className="text-xs text-gray-500">{report.paziente_id}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ml-2 ${getStatusColor(report.stato)}`}
                >
                  {getStatusLabel(report.stato)}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{report.medico_nome}</span>
                  <span>•</span>
                  <span>
                    {new Date(report.data_visita).toLocaleDateString("it-IT")}
                  </span>
                  <span>
                    • {report.titolo}: {report.referto_note}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Eye className="w-4 h-4" />
                  Visualizza
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Download className="w-4 h-4" />
                  Scarica
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              Carica Nuovo Referto
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    ID Paziente
                  </label>
                  <input
                    type="text"
                    placeholder="Es. PT001"
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Nome Paziente
                  </label>
                  <input
                    type="text"
                    placeholder="Nome completo"
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Tipo di Referto
                </label>
                <select className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                  <option>Esami del Sangue</option>
                  <option>Radiografia</option>
                  <option>Risonanza Magnetica</option>
                  <option>Ecografia</option>
                  <option>Elettrocardiogramma</option>
                  <option>TAC</option>
                  <option>Altro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Medico Responsabile
                </label>
                <select className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base">
                  <option>Dr. Anna Marchi</option>
                  <option>Dr. Paolo Verdi</option>
                  <option>Dr. Maria Conti</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Data Referto
                </label>
                <input
                  type="date"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  Descrizione
                </label>
                <textarea
                  rows={3}
                  placeholder="Aggiungi una descrizione del referto..."
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                  File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1 text-sm md:text-base">
                    Trascina il file qui o clicca per selezionare
                  </p>
                  <p className="text-xs md:text-sm text-gray-500">
                    PDF, JPG, PNG fino a 50MB
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm md:text-base"
              >
                Annulla
              </button>
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                Carica Referto
              </button>
            </div>
          </div>
        </div>
      )}

      {refertiSelezionati && (
        <SchedaReferto
          referto={refertiSelezionati}
          onClose={() => setRefertiSelezionati(null)}
        />
      )}
    </div>
  );
}

export default SezioneReferti;
