import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PazienteDashboard from "./comp2/pazienteDash";
import { SidebarP } from "./comp2/sidebar";

import PazienteReferti from "./comp2/pazienteReferti";
import PazientePrenotazioni from "./comp2/pazienteAppuntamenti";
import { useEffect, useState } from "react";
import PazienteLogin from "./comp2/pazienteLogin";
import Register from "./comp2/pazienteRegistrazione";
import { PazienteProfilo } from "./comp2/PazienteProfilo";
//sezione medico/admin
import Admin_Dashboard from "./comp2/admin/adminDash";
import MedicoRegistrazione from "./comp2/admin/medicoRegistrazione";
import SidebarMedico from "./comp2/admin/sidebarAdmin";
import SezionePazienti from "./comp2/admin/medico_Pazienti";
import SezioneReferti from "./comp2/admin/medico_Referti";
import SezionePrenotazioni from "./comp2/admin/medico_visite";
import SezioneProfilo from "./comp2/admin/medico_Profilo";

import { useLoginStore } from "./comp2/pazienti_stores/loginP_store";

function App() {
  const [authView, setAuthView] = useState<
    "role-selector" | "login" | "register" | "register-medico"
  >("login");

  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    role: userRole,
    checkAuth,
    logout: esci,
    loadingCheck,
  } = useLoginStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = () => {};

  const handleRegister = () => {};

  const logout = async () => {
    await esci();
  };

  if (loadingCheck) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {" "}
      {!userRole ? (
        <Routes>
          <Route
            path="*"
            element={
              authView === "login" ? (
                <PazienteLogin
                  onNavigateToRegisterMedico={() =>
                    setAuthView("register-medico")
                  }
                  onLogin={handleLogin}
                  onNavigateToRegister={() => setAuthView("register")}
                  onNavigateToRoleSelector={() => setAuthView("role-selector")}
                />
              ) : authView === "register" ? (
                <Register
                  onRegister={handleRegister}
                  onNavigateToLogin={() => setAuthView("login")}
                  onNavigateToRoleSelector={() => setAuthView("role-selector")}
                />
              ) : (
                <MedicoRegistrazione
                  onRegister={handleRegister}
                  onNavigateToLogin={() => setAuthView("login")}
                  onNavigateToRoleSelector={() => setAuthView("role-selector")}
                />
              )
            }
          />
        </Routes>
      ) : userRole === "patient" ? (
        <>
          <div className="flex h-screen">
            <SidebarP
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isMobileMenuOpen={isMobileMenuOpen}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              onLogout={logout}
            />

            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<PazienteDashboard />} />
                <Route path="/disp/dr/:id" element={<PazientePrenotazioni />} />
                <Route path="/pazienti/dash" element={<PazienteDashboard />} />
                <Route
                  path="/prenotazioni/join-referti/paziente/:id"
                  element={<PazienteReferti />}
                />
                <Route
                  path="/pazienti/profilo/me"
                  element={<PazienteProfilo />}
                />
              </Routes>
            </main>
          </div>
        </>
      ) : (
        <div className="flex h-screen">
          <SidebarMedico
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            onLogout={logout}
          />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Admin_Dashboard />} />
              <Route
                path="/prenotazioni/pazienti/me"
                element={<SezionePazienti />}
              />
              <Route
                path="/prenotazioni/join-referti/dr/me"
                element={<SezioneReferti />}
              />
              <Route
                path="/prenotazioni/dr/me"
                element={<SezionePrenotazioni />}
              />
              <Route path="/medici/profilo/me" element={<SezioneProfilo />} />
            </Routes>
          </main>
        </div>
      )}
    </Router>
  );
}

export default App;
