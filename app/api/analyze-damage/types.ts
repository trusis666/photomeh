export interface DamageItem {
  type: string;
  severity: "minor" | "moderate" | "severe";
  estimatedCost: number;
  description: string;
  location?: string;
}

export interface DamageEstimate {
  damages: DamageItem[];
  laborHours: number;
  partsNeeded: string[];
  confidence: number;
  totalCost: number;
  summary?: string;
  recommendations?: string[];
}

export type SeverityLevel = "minor" | "moderate" | "severe";

export interface ApiError {
  error: string;
  details: string;
}
