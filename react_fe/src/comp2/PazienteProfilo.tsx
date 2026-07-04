import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Profilo } from "../comp2/minicomp/export_types";
import axios from "axios";
import { Input } from "./minicomp/input";
import { Button } from "./minicomp/pulsante";
import api from "../axiosInstance";

export function PazienteProfilo() {
  const [profilo, setProfilo] = useState<Profilo | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profilo | null>(null);
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");

  useEffect(() => {
    api
      .get("/pazienti/profilo/me")
      .then((response) => {
        // console.log("Profilo ricevuto:", response.data);
        setProfilo(response.data);
        // Sincronizza anche formData quando il profilo viene caricato
        setFormData({ ...response.data, id: response.data.paziente_id });
      })
      .catch((error) => {
        console.error("Errore caricamento profilo:", error);
      });
  }, []);

  const handleChange = (field: string, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: ["peso", "altezza"].includes(field) ? Number(value) : value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await api.patch(
        "/pazienti/modifica_profilo/me",
        formData,
      );

      setProfilo(response.data);
      setIsEditing(false);
      console.log("Dati aggiornati:", response.data);
      alert("Profilo aggiornato con successo!");
    } catch (error) {
      console.error("Errore nel salvataggio:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.detail || "Errore durante il salvataggio");
      } else {
        alert("Errore durante il salvataggio del profilo");
      }
    }
  };

  const handleCancel = () => {
    setFormData(profilo);
    setIsEditing(false);
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const addAllergy = () => {
    if (!formData) return;

    if (newAllergy.trim()) {
      setFormData({
        ...formData,
        allergie: [...(formData.allergie || []), newAllergy.trim()],
      });
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    if (!formData) return;

    setFormData({
      ...formData,
      allergie: (formData.allergie || []).filter((_, i) => i !== index),
    });
  };
  const addCondition = () => {
    if (!formData) return;

    if (newCondition.trim()) {
      setFormData({
        ...formData,
        condizioni: [...(formData.condizioni || []), newCondition.trim()],
      });
      setNewCondition("");
    }
  };

  const removeCondition = (index: number) => {
    if (!formData) return;

    setFormData({
      ...formData,
      condizioni: (formData.condizioni || []).filter((_, i) => i !== index),
    });
  };

  const calculateAge = () => {
    if (!profilo?.data_nascita) return 0;
    const today = new Date();
    const birth = new Date(profilo.data_nascita);
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
            Il Mio Profilo
          </h3>
          <p className="text-gray-500 mt-1">
            Gestisci le tue informazioni personali
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
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Edit2 className="w-5 h-5" />
              Modifica Profilo
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-semibold text-3xl">
                  {profilo?.nome[0].toUpperCase()}
                  {profilo?.cognome[0].toUpperCase()}
                </span>
              </div>
              <h3 className="font-semibold text-xl text-gray-900">
                {profilo?.nome} {profilo?.cognome}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Paziente</p>
              <p className="text-gray-500 text-sm">ID: PT001</p>
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Età</span>
                <span className="font-semibold text-gray-900">
                  {calculateAge()} anni
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Gruppo Sanguigno</span>
                <span className="font-semibold text-gray-900">
                  {profilo?.gruppo_sanguigno}
                </span>
              </div>
              {/* altezza */}
              {isEditing ? (
                <div className="space-y-1">
                  <label className="text-xs text-gray-600 px-3">Altezza</label>
                  <Input
                    value={formData?.altezza || ""}
                    onChange={(e) => handleChange("altezza", e.target.value)}
                    className="text-center font-semibold"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Altezza</span>
                  <span className="font-semibold text-gray-900">
                    {profilo?.altezza || ""}
                  </span>
                </div>
              )}
              {/* peso */}
              {isEditing ? (
                <div className="space-y-1">
                  <label className="text-xs text-gray-600 px-3">Peso</label>
                  <Input
                    value={formData?.peso}
                    onChange={(e) => handleChange("peso", e.target.value)}
                    className="text-center font-semibold"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Peso</span>
                  <span className="font-semibold text-gray-900">
                    {profilo?.peso || ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generalità */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informazioni personali */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Informazioni Personali
              </h4>
            </div>
            {/* FINIRE DI RENDERE MODIFICABILE LA SCHEDA PROFILO. SISTEMARE IL
            PULSANTE MODIFICA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome
                </label>

                {isEditing ? (
                  <Input
                    value={formData?.nome || ""}
                    onChange={(e) => handleChange("nome", e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{formData?.nome}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Cognome
                </label>
                {isEditing ? (
                  <Input
                    value={formData?.cognome}
                    onChange={(e) => handleChange("cognome", e.target.value)}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{formData?.cognome}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data di nascita
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-gray-900">
                    {profilo?.data_nascita &&
                      new Date(profilo.data_nascita).toLocaleDateString(
                        "it-IT",
                      )}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Codice Fiscale
                </label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-900 font-mono">
                    {profilo?.codice_fiscale}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
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
                    <p className="text-gray-900">{formData?.email}</p>
                  </div>
                )}
              </div>

              <div>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData?.numero_telefono}
                      onChange={(e) =>
                        handleChange("numero_telefono", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formData?.numero_telefono}</p>
                  </div>
                )}
              </div>

              <div>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData?.indirizzo}
                      onChange={(e) =>
                        handleChange("indirizzo", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{formData?.indirizzo}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Informazioni Mediche
              </h4>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Allergie
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData?.allergie && formData.allergie.length > 0 ? (
                    formData.allergie.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium"
                      >
                        {allergy}
                        {isEditing && (
                          <button
                            onClick={() => removeAllergy(index)}
                            className="hover:bg-red-100 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Nessuna allergia
                    </span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Aggiungi allergia"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyUp={(e) => e.key === "Enter" && addAllergy()}
                    />
                    <Button onClick={addAllergy} size="sm">
                      Aggiungi
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Condizioni croniche
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData?.condizioni && formData.condizioni.length > 0 ? (
                    formData.condizioni.map((condition, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {condition}
                        {isEditing && (
                          <button
                            onClick={() => removeCondition(index)}
                            className="hover:bg-orange-100 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Nessuna condizione cronica registrata
                    </span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Aggiungi condizione"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addCondition()}
                    />
                    <Button onClick={addCondition} size="sm">
                      Aggiungi
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">
                Contatto di Emergenza
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nome
                </label>
                {isEditing ? (
                  <Input
                    value={formData?.nome_emergenza || ""}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        "nome_emergenza",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{formData?.nome_emergenza}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Relazione
                </label>
                {isEditing ? (
                  <Input
                    value={formData?.relazione || ""}
                    onChange={(e) =>
                      handleEmergencyContactChange("relazione", e.target.value)
                    }
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">{formData?.relazione}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Telefono
                </label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={formData?.numero_emergenza || ""}
                    onChange={(e) =>
                      handleEmergencyContactChange(
                        "numero_emergenza",
                        e.target.value,
                      )
                    }
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {formData?.numero_emergenza}
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

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}
export default PazienteProfilo;
