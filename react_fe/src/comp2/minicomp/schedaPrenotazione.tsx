import { X } from "lucide-react";
import type { Medico, Disponibilita, PrenotazioneJoinPM } from "./export_types";
import { useState } from "react";

type Props = {
  aperto: boolean;
  medici: Medico[];
  disponibilita: Disponibilita[];
  prenotazione?: PrenotazioneJoinPM | null;

  onClose: () => void;
  onConfirm: (data: {
    medico_id: number;
    data_visita: string;
    ora_visita: string;
    note: string;
  }) => void;
};

export function SchedaPrenotazione({
  aperto,
  medici,
  disponibilita,
  prenotazione,
  onClose,
  onConfirm,
}: Props) {
  const [medicoScelto, setMedicoScelto] = useState(
    prenotazione?.medico_id?.toString() || "",
  );
  const [giornoScelto, setGiornoScelto] = useState(
    prenotazione?.data_visita || "",
  );
  const [orarioScelto, setOrarioScelto] = useState(
    prenotazione?.ora_visita || "",
  );
  const [notaScritta, setNotaScritta] = useState(prenotazione?.note || "");

  // Filtra le disponibilità per il medico selezionato
  const generateSlotsFromDisponibilita = (
    disponibilitaMedico: Disponibilita[],
    daysAhead: number = 14,
  ) => {
    const slots: Array<{ date: string; slots: string[] }> = [];
    const today = new Date();

    for (let i = 0; i < daysAhead; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay(); // 0=Domenica, 1=Lunedì, ecc.

      // Converti: JavaScript usa 0=Domenica, tu usi 0=Lunedì
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      // Trova disponibilità per questo giorno
      const dispGiorno = disponibilitaMedico.find(
        (d) => d.giorno_settimana === adjustedDay,
      );

      if (!dispGiorno) continue;

      const daySlots: string[] = [];
      const [startHour, startMin] = dispGiorno.ora_inizio
        .split(":")
        .map(Number);
      const [endHour, endMin] = dispGiorno.ora_fine.split(":").map(Number);

      let currentTime = startHour * 60 + startMin; // converti in minuti
      const endTime = endHour * 60 + endMin;

      while (currentTime < endTime) {
        const hour = Math.floor(currentTime / 60);
        const minute = currentTime % 60;
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        daySlots.push(timeStr);
        currentTime += dispGiorno.durata_slot;
      }

      if (daySlots.length > 0) {
        slots.push({
          date: date.toISOString().split("T")[0],
          slots: daySlots,
        });
      }
    }

    return slots;
  };

  const slotsDisponibili = medicoScelto
    ? generateSlotsFromDisponibilita(
        disponibilita.filter((d) => d.medico_id === Number(medicoScelto)),
      )
    : [];

  if (!aperto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h3 className="text-xl font-semibold">
            {prenotazione ? "Modifica appuntamento" : "Nuovo appuntamento"}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* 1. Selezione Medico */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {medici.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMedicoScelto(String(m.id));
                setGiornoScelto("");
                setOrarioScelto("");
              }}
              className={`p-4 border rounded-lg transition-all ${
                medicoScelto === String(m.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className="font-semibold">
                {m.nome} {m.cognome}
              </p>
              <p className="text-sm">{m.specializzazione}</p>
            </button>
          ))}
        </div>

        {/* 2. Selezione Giorno */}
        {medicoScelto && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              2. Seleziona la Data
            </label>
            {slotsDisponibili.length === 0 ? (
              <p className="text-gray-500 italic">
                Nessuna data disponibile per questo medico
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {slotsDisponibili.map((slot) => (
                  <button
                    key={slot.date}
                    onClick={() => {
                      setGiornoScelto(slot.date);
                      setOrarioScelto("");
                    }}
                    className={`p-3 border-2 rounded-lg transition-all ${
                      giornoScelto === slot.date
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className="text-xs text-gray-600">
                      {new Date(slot.date).toLocaleDateString("it-IT", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(slot.date).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Selezione Orario */}
        {giornoScelto && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3. Seleziona Orario
            </label>
            <div className="flex flex-wrap gap-2">
              {slotsDisponibili
                .find((s) => s.date === giornoScelto)
                ?.slots.map((ora) => (
                  <button
                    key={ora}
                    onClick={() => setOrarioScelto(ora)}
                    className={`px-3 py-1 border rounded-lg transition-all ${
                      orarioScelto === ora
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {ora}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Note */}
        <textarea
          value={notaScritta}
          onChange={(e) => setNotaScritta(e.target.value)}
          className="w-full border rounded-lg p-2 mb-6"
          placeholder="Note (opzionali)"
        />

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border hover:bg-gray-100"
          >
            Annulla
          </button>
          <button
            disabled={!medicoScelto || !giornoScelto || !orarioScelto}
            onClick={() =>
              onConfirm({
                medico_id: Number(medicoScelto),
                data_visita: giornoScelto,
                ora_visita: orarioScelto,
                note: notaScritta,
              })
            }
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}
