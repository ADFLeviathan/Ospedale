import { useState } from "react";
import { Heart, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "./minicomp/pulsante";
import { Input } from "./minicomp/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./minicomp/card";
import { useLoginStore } from "./pazienti_stores/loginP_store";

interface LoginProps {
  onLogin: (role: "admin" | "patient") => void;
  onNavigateToRegister: () => void;
  onNavigateToRoleSelector: () => void;
  onNavigateToRegisterMedico: () => void;
}

export function PazienteLogin({
  onLogin,
  onNavigateToRegister,
  onNavigateToRoleSelector,
  onNavigateToRegisterMedico,
}: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLoginStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const role = await login(username, password);
      if (role) {
        onLogin(role);
      }
    } catch {
      alert("Username o password errati");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Nome app/sito</h1>
          </div>
          <p className="text-gray-600">Accedi al tuo account</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Accedi</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              {/* Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Ricordami
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Password dimenticata?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Accedi
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          <div className="text-sm text-gray-600">
            Sei un nuovo paziente?{" "}
            <button
              onClick={onNavigateToRegister}
              className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
            >
              Registrati ora come paziente
            </button>
            <p className="text-sm text-gray-600">
              Sei un medico?{" "}
              <button
                onClick={onNavigateToRegisterMedico}
                className="text-blue-600 hover:underline font-semibold"
              >
                Registrati come medico
              </button>
            </p>
          </div>
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

export default PazienteLogin;
