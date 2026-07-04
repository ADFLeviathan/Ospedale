import {
  FileText,
  Download,
  Eye,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { JoinReferto } from "../comp2/minicomp/export_types";
import { SchedaReferto } from "./minicomp/mostraReferto";
import { usePazienteStore } from "./pazienti_stores/pazienteStore";
import { useRefertiStore } from "./admin/medici_stores/refertiStore";

export function PazienteReferti() {
  const fetchPaziente = usePazienteStore((s) => s.fetchPaziente);
  const referto = useRefertiStore((s) => s.joinRefertiPaziente);
  const nuoviReferti = referto.filter((r) => !r.referto_aperto).length;
  const fetchJoinRefertiPaziente = useRefertiStore(
    (s) => s.fetchJoinRefertiPaziente,
  );
  const contrassegnaComeAperti = useRefertiStore(
    (s) => s.contrassegnaComeAperto,
  );

  //dettagli paziente
  useEffect(() => {
    fetchPaziente();
  }, [fetchPaziente]);

  useEffect(() => {
    fetchJoinRefertiPaziente();
  }, [fetchJoinRefertiPaziente]);

  const [searchTerm, setSearchTerm] = useState("");
  const [refertiSelezionati, setRefertiSelezionati] =
    useState<JoinReferto | null>(null);

  //criteri del filtro
  const referti_filtrati =
    referto?.filter(
      (r: JoinReferto) =>
        r.referto_note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.titolo?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            I Miei Referti
          </h3>
          <p className="text-gray-500 mt-1">Accedi ai tuoi documenti medici</p>
        </div>
      </div>
      {/* Dati */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nuovi referti</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {nuoviReferti}
              </p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Totale referti</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {referto.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Questo Mese</p>
              <p className="text-2xl font-semibold text-purple-600 mt-1">2</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
      {/* Filtro di ricerca */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca per nome referto, tipo o medico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
            Filtri
          </button>
        </div>
      </div>
      {/* Referti */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {referti_filtrati.map((r: JoinReferto) => (
          <div
            key={r.referto_id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setRefertiSelezionati(r)}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {r.titolo}
                    </h4>
                  </div>
                  {r.referto_aperto == false && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                      Nuovo
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {r.referto_note}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(r.data_visita).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-600">
                    Medico: {r.medico_nome} {r.medico_cognome}
                  </span>
                  <span className="text-sm font-medium text-gray-900"></span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-4 ">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await contrassegnaComeAperti(r.referto_id);

                      // Mostra il referto selezionato
                      setRefertiSelezionati({ ...r, referto_aperto: true });
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Visualizza
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Scarica
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Mostra referto */}{" "}
      {refertiSelezionati && (
        <SchedaReferto
          referto={refertiSelezionati}
          onClose={() => setRefertiSelezionati(null)}
        />
      )}
    </div>
  );
}

export default PazienteReferti;
