import { useState } from "react";
import {
  Heart,
  Mail,
  Lock,
  User,
  Phone,
  Calendar,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../minicomp/pulsante";
import { Input } from "../minicomp/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../minicomp/card";

import { useRegisterStore } from "../pazienti_stores/registrazioneStore";
import type { Role } from "../pazienti_stores/loginP_store";

interface RegisterProps {
  onRegister: (role: "admin" | "patient") => void;
  onNavigateToLogin: () => void;
  onNavigateToRoleSelector: () => void;
}

export function MedicoRegistrazione({
  onRegister,
  onNavigateToLogin,
  onNavigateToRoleSelector,
}: RegisterProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    n_telefono: "",
    data_nascita: "",
    password: "",
    conferma_password: "",
    codice_fiscale: "",
    username: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [acceptTerms, setAcceptTerms] = useState(false);
  const registra_medico = useRegisterStore((s) => s.registra_medico);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.conferma_password) {
      alert("Le password non corrispondono");
      return;
    }
    if (!acceptTerms) {
      alert("Devi accettare i termini e condizioni");
      return;
    }

    const payload = {
      email: formData.email,
      username: formData.username,
      password: formData.password,
      role: "admin" as Role,

      nome: formData.nome,
      cognome: formData.cognome,
      codice_fiscale: formData.codice_fiscale,
      data_nascita: formData.data_nascita,
      n_telefono: formData.n_telefono,
    };

    try {
      const role = await registra_medico(payload);
      if (role) {
        onRegister(role);
      }
    } catch (error) {
      console.error("Errore POST:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">MediCare Pro</h1>
          </div>
          <p className="text-gray-600">Crea il tuo account</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Registrazione</CardTitle>
            <CardDescription>
              Compila il modulo per creare un nuovo account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nomi campi prima riga */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* nome */}
                <div className="space-y-2">
                  <label htmlFor="nome" className="text-sm text-gray-700">
                    Nome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Mario"
                      value={formData.nome}
                      onChange={(e) => handleChange("nome", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* cognome */}
                <div className="space-y-2">
                  <label htmlFor="cognome" className="text-sm text-gray-700">
                    Cognome
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="cognome"
                      type="text"
                      placeholder="Rossi"
                      value={formData.cognome}
                      onChange={(e) => handleChange("cognome", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Altre righe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@esempio.it"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Numero di telefono */}
                <div className="space-y-2">
                  <label htmlFor="n_telefono" className="text-sm text-gray-700">
                    Telefono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="n_telefono"
                      type="tel"
                      placeholder="+39 123 456 7890"
                      value={formData.n_telefono}
                      onChange={(e) =>
                        handleChange("n_telefono", e.target.value)
                      }
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Data di nascita */}
              <div className="space-y-2">
                <label htmlFor="data_nascita" className="text-sm text-gray-700">
                  Data di Nascita
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="data_nascita"
                    type="date"
                    value={formData.data_nascita}
                    onChange={(e) =>
                      handleChange("data_nascita", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* codice fiscale */}
              <div className="space-y-2">
                <label
                  htmlFor="codice_fiscale"
                  className="text-sm text-gray-700"
                >
                  Codice fiscale
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="codice_fiscale"
                    type="text"
                    value={formData.codice_fiscale}
                    onChange={(e) =>
                      handleChange("codice_fiscale", e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="conferma_password"
                    className="text-sm text-gray-700"
                  >
                    Conferma Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="conferma_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.conferma_password}
                      onChange={(e) =>
                        handleChange("conferma_password", e.target.value)
                      }
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/*Conferma Password  */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 font-semibold mb-2">
                  Requisiti password:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    Almeno 8 caratteri
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    Una lettera maiuscola e una minuscola
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    Almeno un numero
                  </li>
                </ul>
              </div>

              {/* TOS */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Accetto i{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    termini e condizioni
                  </button>{" "}
                  e la{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:underline"
                  >
                    privacy policy
                  </button>
                </label>
              </div>

              {/* Pulsante registra */}
              <Button
                type="submit"
                className="w-full h-11 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Crea Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Hai già un account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
            >
              Accedi ora
            </button>
          </p>
          <button
            onClick={onNavigateToRoleSelector}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Torna alla selezione ruolo
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicoRegistrazione;
