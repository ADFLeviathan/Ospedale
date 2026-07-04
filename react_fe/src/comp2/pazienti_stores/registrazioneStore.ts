import { create } from "zustand";
import axios from "axios";
import type { Profilo } from "../minicomp/export_types";
import { useLoginStore, type Role } from "./loginP_store";
import api from "../../axiosInstance";

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  role: Role;

  nome: string;
  cognome: string;
  codice_fiscale: string;
  data_nascita: string;
  n_telefono: string;
  allergie?: string[];
  condizioni_croniche?: string[];
}

interface RegistrazioneState {
  loading: boolean;
  error: string | null;
  registra_paziente: (data: RegisterPayload) => Promise<Role>;
  registra_medico: (data: RegisterPayload) => Promise<Role>;
}

export const useRegisterStore = create<RegistrazioneState>((set) => ({
  loading: false,
  error: null,
  registra_paziente: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<Profilo>(
        "/registrazione",
        data,
      );
      const role = await useLoginStore.getState().login(data.username, data.password)
      console.log("Account creato:", res.data);
      return role;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Dettagli errore:", error.response?.data);
      }
      set({
        error: "Errore durante la registrazione del paziente",
        loading: false,
      });
      throw error;
    } finally {set({loading: false});}
  },

  registra_medico: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<Profilo>(
        "/registrazioneM",
        data,
      );
      console.log("Account medico creato:", res.data);
      return data.role;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Dettagli errore:", error.response?.data);
      }
      set({
        error: "Errore durante la registrazione del medico",
        loading: false,
      });
      throw error;
    } finally {set({loading: false});}
  },
}));
