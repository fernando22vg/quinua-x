export interface Sector {
  id: number;
  name: string;
  location: string;
  moisture: number; // Percentage, e.g., 18
  cropHealth: number; // Percentage, e.g., 78
  nitrogen15: number; // ‰ delta 15N, e.g., +12.4
  oxygen18: number; // ‰ delta 18O, e.g., -4.2
  deuterium: number; // ‰ delta 2H, e.g., -32.1
  soilType: string;
  elevation: number; // meters e.g. 3850
  cropStatus: "OPTIMAL" | "CAUTION" | "CRITICAL";
  alerts: string[];
}

export interface Isotope {
  id: string;
  symbol: string;
  fullName: string;
  protons: number;
  neutrons: number;
  electrons: number;
  status: string;
  description: string;
  agronomicalPurpose: string;
  nuclearFormula: string;
  halfLife: string; // e.g., "Stable Isotope"
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SatelliteLayer {
  id: string;
  name: string;
  opacity: number;
  colorHex: string;
  caption: string;
}
