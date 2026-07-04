import { FileText, Download } from "lucide-react";
import type { JoinReferto } from "./export_types";

// ricaca data di nascita da codice fiscale
function estraiDataNascita(cf: string | undefined | null): string {
  if (!cf || cf.length !== 16) return "N/D";

  try {
    let anno = parseInt(cf.slice(6, 8), 10);
    const annoCorrente = new Date().getFullYear() % 100;
    anno += anno <= annoCorrente ? 2000 : 1900;

    const mesi: Record<string, number> = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      H: 5,
      L: 6,
      M: 7,
      P: 8,
      R: 9,
      S: 10,
      T: 11,
    };
    const meseChar = cf[8].toUpperCase();
    const mese = mesi[meseChar];
    if (mese === undefined) return "Mese non valido";

    let giorno = parseInt(cf.slice(9, 11), 10);
    if (giorno > 40) giorno -= 40; // donne (giorno + 40)

    const dataObj = new Date(anno, mese, giorno);
    return dataObj.toLocaleDateString("it-IT");
  } catch (e) {
    console.error("Errore calcolo: ", e);
    return "N/D";
  }
}

interface Props {
  referto: JoinReferto;
  onClose: () => void;
}

export function SchedaReferto({ referto, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {referto.titolo}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-2xl text-gray-500">×</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Data</p>
                <p className="font-medium text-gray-900">
                  {new Date(referto.data_visita).toLocaleDateString("it-IT", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Medico</p>
                <p className="font-medium text-gray-900">
                  {referto.medico_nome} {referto.medico_cognome}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Descrizione</p>
              <p className="text-gray-900">{referto.referto_note}</p>
            </div>
          </div>

          {/* Anteprima */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-2">
              Anteprima Documento
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Il documento verrà visualizzato qui
            </p>
            <div className="space-y-2 max-w-md mx-auto text-left bg-gray-50 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Paziente:</strong> {referto.paziente_nome}{" "}
                {referto.paziente_cognome}
              </p>
              <p className="text-sm">
                <strong>Data Nascita:</strong>{" "}
                {estraiDataNascita(referto.codice_fiscale)}
              </p>
              <p className="text-sm">
                <strong>Codice Fiscale:</strong> {referto.codice_fiscale}
              </p>
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-medium mb-2">
                  Risultati Principali:
                </p>
                <p className="text-sm text-gray-600">
                  Tutti i valori risultano nella norma. Si consiglia controllo
                  periodico.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-5 h-5" />
              Scarica PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-5 h-5" />
              Stampa
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// {refertiSelezionati && (
//   <SchedaReferto
//     referto={refertiSelezionati}
//     onClose={() => setRefertiSelezionati(null)}
//   />
// )}
