import { X } from "lucide-react";
import type { PrenotazioneJoinPM, PrenotazioneModificabile } from "../minicomp/export_types";

type Props = {
  aperto: boolean;
  prenotazione: PrenotazioneJoinPM | PrenotazioneModificabile| null;
  onClose: () => void;
  onConfirm: () => void;
};

export function SchedaEliminazione({
  aperto,
  prenotazione,
  onClose,
  onConfirm,
}: Props) {
  if (!aperto || !prenotazione) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-semibold">
            Vuoi annullare questa prenotazione?
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          L’operazione non può essere annullata.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border rounded-lg">
            No
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg"
          >
            Elimina
          </button>
        </div>
      </div>
    </div>
  );
}
