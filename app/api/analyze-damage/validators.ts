import { MIN_IMAGE_LENGTH, SEVERITY_LEVELS, MAX_CONFIDENCE } from "./constants";
import type { SeverityLevel } from "./types";

export function validateImageData(imageBase64: string): boolean {
  if (!imageBase64 || imageBase64.length < MIN_IMAGE_LENGTH) {
    return false;
  }

  // Check if it's a valid base64 data URL
  const base64Pattern = /^data:image\/(png|jpg|jpeg|webp);base64,/;
  return base64Pattern.test(imageBase64);
}

export function normalizeConfidence(confidence: number): number {
  // Handle percentage values (e.g., 85 -> 0.85)
  if (confidence > MAX_CONFIDENCE) {
    return confidence / 100;
  }
  return Math.min(Math.max(confidence, 0), MAX_CONFIDENCE);
}

export function validateSeverity(severity: string): SeverityLevel {
  const normalized = severity.toLowerCase();
  if (SEVERITY_LEVELS.includes(normalized as any)) {
    return normalized as SeverityLevel;
  }
  return "moderate"; // Default fallback
}
