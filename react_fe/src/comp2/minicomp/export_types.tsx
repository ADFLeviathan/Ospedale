export type PrenotazioneJoinPM = {
  id: number;
  paziente_id: number;
  medico_id: number;
  reparto_id: number;
  paziente_nome: string;
  paziente_cognome: string;
  medico_nome: string;
  medico_cognome: string;
  data_visita: string;
  ora_visita: string;
  medico_specializzazione: string;
  nome_reparto: string;
  created_at: string;
  stato: "prenotata" | "completata" | "annullata";
  note: string;
};
export type Paziente = {
  id: number;
  nome: string;
  cognome: string;
  codice_fiscale: string;
  data_nascita: Date;
  email: string;
  n_telefono: string;
};

export type Medico = {
  id: number;
  nome: string;
  cognome: string;
  specializzazione: string;
  email: string;
  n_telefono: string;
  codice_fiscale: string;
  data_nascita: string;
  reparti: Reparto[]; 
};

export type Reparto = {
  id: number;
  nome: string;
  descrizione: string;
  piano: number;
};

export type Prenotazione = {
  id: number;
  paziente_id: number;
  medico_id: number;
  reparto_id: number;
  data_visita: string;
  ora_visita: string;
};

export type Referto = {
  id: number;
  pressione_min: number;
  pressione_max: number;
  freq_cardiaca: number;
  peso: number;
  temperatura: number;
  note: string;
  medico_id: number;
  paziente_id: number;
  created_at: string;
  aperto: boolean;
};

export type Disponibilita = {
  id: number;
  medico_id: number;
  giorno_settimana: number;
  ora_inizio: string;
  ora_fine: string;
  durata_slot: number;
  attivo: boolean;
};

export type JoinReferto = {

  id: number;
  paziente_id: number;
  medico_id: number;
  reparto_id: number;
  paziente_nome: string;
  paziente_cognome: string;
  codice_fiscale: string;
  medico_nome: string;
  medico_cognome: string;
  data_visita: string;
  ora_visita: string;
  medico_specializzazione: string;
  nome_reparto: string;
  created_at: string;
  stato: "prenotata" | "completata" | "annullata";
  referto_id: number;
  titolo: string;
  pressione_min: number | null;
  pressione_max: number | null;
  freq_cardiaca: number | null;
  peso: number | null;
  temperatura: number | null;
  referto_note: string | null;
  referto_aperto: boolean;
  aperto: boolean;
  updated_at: string;
  durata_slot: number;
};

export type Profilo = {
  id: number;
  nome: string;
  cognome: string;
  codice_fiscale: string;
  altezza: number;
  eta: number;
  gruppo_sanguigno: string;
  peso: number;
  data_nascita: string;
  email: string;
  numero_telefono: string;
  indirizzo: string;
  allergie: string[];
  condizioni: string[];
  nome_emergenza: string | null;
  relazione: string | null;
  numero_emergenza: string | null;
  created_at: string;
};

export interface PrenotazioneModificabile {
  paziente_id: number;
  medico_id: number;
  reparto_id: number;
  data_visita: string;
  ora_visita: string;
  stato?: "prenotata" | "completata" | "annullata";
  note?: string;
}
