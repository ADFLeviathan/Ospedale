/* eslint-disable @typescript-eslint/no-unused-vars */
import { User, Mail, Phone, Edit2, Save, X, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../minicomp/input";
import { Button } from "../minicomp/pulsante";
import axios from "axios";
import type { Medico } from "../minicomp/export_types";
import { useProfiloStore } from "./medici_stores/profiloMedicoStore";

export function SezioneProfilo() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Medico | null>(null);
  const profilo_medico = useProfiloStore((state) => state.profiloMedico);

  const fetchProfiloMedico = useProfiloStore(
    (state) => state.fetchProfiloMedico,
  );
  const aggiornaProfiloMedico = useProfiloStore(
    (state) => state.aggiornaProfiloMedico,
  );

  useEffect(() => {
    fetchProfiloMedico();
  }, [fetchProfiloMedico]);

  const handleCancel = () => {
    setFormData(profilo_medico);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await aggiornaProfiloMedico(formData);
      setIsEditing(false);
      alert("Profilo aggiornato con successo!");
    } catch {
      alert("Errore durante il salvataggio del profilo");
    }
  };

  const handleChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: ["peso", "altezza"].includes(field) ? Number(value) : value,
    });
  };

  // const handleEmergencyContactChange = (field: string, value: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     emergencyContact: { ...prev.emergencyContact, [field]: value },
  //   }));
  // };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Profilo Amministratore
          </h3>
          <p className="text-gray-500 mt-1">
            Gestisci le tue informazioni professionali
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Annulla
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-5 h-5" />
                Salva Modifiche
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                if (profilo_medico) setFormData({ ...profilo_medico });
                setIsEditing(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Edit2 className="w-5 h-5" />
              Modifica Profilo
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profilo base */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-semibold text-3xl">AM</span>
              </div>
              <h3 className="font-semibold text-xl text-gray-900">
                Dr. {profilo_medico?.nome} {profilo_medico?.cognome}
              </h3>

              <p className="text-gray-500 text-sm">
                ID: D00{profilo_medico?.id}
              </p>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-600 block mb-1">
                  Dipartimento
                </span>
                <span className="font-semibold text-gray-900 text-sm">
                  {formData?.reparti?.map((r) => r.nome).join(", ")}
                </span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-xs text-gray-600 block mb-1">
                  Specializzazione
                </span>
                <span className="font-semibold text-gray-900 text-sm">
                  {profilo_medico?.specializzazione}
                </span>
              </div>
            </div>

            {/* Cambia password */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Cambia Password
              </Button>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Informazioni Personali
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome
                </label>
                {isEditing ? (
                  <Input
                    value={formData?.nome}
                    onChange={(e) => handleChange("nome", e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{profilo_medico?.nome}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cognome
                </label>
                {isEditing ? (
                  <Input
                    onChange={(e) => handleChange("cognome", e.target.value)}
                    value={formData?.cognome ?? ""}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{profilo_medico?.cognome}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Dipartimento
                </label>
                {isEditing ? (
                  <Input
                    value={formData?.reparti?.map((r) => r.nome).join(", ")}
                    onChange={(e) => handleChange("reparti", e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {profilo_medico?.reparti?.map((r) => r.nome).join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Specializzazione
                </label>
                {isEditing ? (
                  <Input
                    value={formData?.specializzazione}
                    onChange={(e) =>
                      handleChange("specializzazione", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {profilo_medico?.specializzazione}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informazioni di contatto */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Phone className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Contatti</h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="email"
                      value={formData?.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{profilo_medico?.email}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Telefono
                </label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData?.n_telefono}
                      onChange={(e) =>
                        handleChange("n_telefono", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">
                      {profilo_medico?.n_telefono}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SezioneProfilo;
