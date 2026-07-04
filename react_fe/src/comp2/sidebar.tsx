import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { usePazienteStore } from "./pazienti_stores/pazienteStore";

export const Nav = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="flex flex-row w-full h-16 left-0 bg-blue-300 mx-0 p-0 justify-center items-center">
      <ul className="flex gap-3">
        <li>
          <Link to="/pazienti/dash">Home</Link>
        </li>
        <li>
          <Link to="/medici">Medici</Link>
        </li>

        <li>
          <Link to={`/disp/dr/me`}>Appuntamenti</Link>
        </li>
        <li>
          <Link to={`/prenotazioni/join-referti/paziente/me`}>Referti</Link>
        </li>
      </ul>
      <button
        onClick={onLogout}
        className="ml-auto flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

interface PatientSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  onOpenMobileMenu?: () => void;
  onLogout: () => void;
}

export function SidebarP({
  activeSection,
  onSectionChange,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onOpenMobileMenu,
  onLogout,
}: PatientSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
    {
      id: "appuntamenti",
      label: "I Miei Appuntamenti",
      icon: Calendar,
      path: "/disp/dr/me",
    },
    {
      id: "referti",
      label: "I Miei Referti",
      icon: FileText,
      path: "/prenotazioni/join-referti/paziente/me",
    },

    {
      id: "profilo",
      label: "Profilo",
      icon: User,
      path: "/pazienti/profilo/me",
    },
  ];

  const paziente = usePazienteStore((s) => s.paziente);
  const fetchPaziente = usePazienteStore((s) => s.fetchPaziente);
  useEffect(() => {
    fetchPaziente();
  }, [fetchPaziente]);

  return (
    <>
      {!isMobileMenuOpen && (
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0" onClick={onCloseMobileMenu} />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onCloseMobileMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="font-semibold text-lg">MediCare</h1>
              <p className="text-xs text-gray-500">Portale Paziente</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <li key={item.id}>
                  <Link
                    onClick={() => {
                      onSectionChange(item.id);
                      onCloseMobileMenu?.();
                    }}
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-semibold">MR</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {" "}
                {paziente?.nome} {paziente?.cognome}
              </p>
              <p className="text-xs text-gray-500">ID: PT001</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
