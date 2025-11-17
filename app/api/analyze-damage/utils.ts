import type { DamageEstimate, DamageItem } from "./types";
import { validateSeverity, normalizeConfidence } from "./validators";
import { AVERAGE_LABOR_RATE } from "./constants";

export function sanitizeEstimate(rawEstimate: any): DamageEstimate {
  // Ensure damages array exists
  const damages: DamageItem[] = Array.isArray(rawEstimate.damages)
    ? rawEstimate.damages.map((damage: any) => ({
        type: damage.type || "Unknown Damage",
        severity: validateSeverity(damage.severity || "moderate"),
        estimatedCost: Number(damage.estimatedCost) || 0,
        description: damage.description || "No description provided",
        location: damage.location,
      }))
    : [];

  // Calculate total cost if missing
  const damagesCost = damages.reduce(
    (sum, damage) => sum + damage.estimatedCost,
    0,
  );
  const laborCost = (rawEstimate.laborHours || 0) * AVERAGE_LABOR_RATE;
  const totalCost = rawEstimate.totalCost || damagesCost + laborCost;

  return {
    damages,
    laborHours: Number(rawEstimate.laborHours) || 0,
    partsNeeded: Array.isArray(rawEstimate.partsNeeded)
      ? rawEstimate.partsNeeded
      : [],
    confidence: normalizeConfidence(rawEstimate.confidence || 0),
    totalCost: Math.round(totalCost * 100) / 100, // Round to 2 decimals
    summary: rawEstimate.summary,
    recommendations: Array.isArray(rawEstimate.recommendations)
      ? rawEstimate.recommendations
      : undefined,
  };
}

export function logRequest(imageBase64: string): void {
  console.log("=== Damage Analysis Request ===");
  console.log("Provider: OpenAI Vision API (gpt-4o)");
  console.log("Timestamp:", new Date().toISOString());
  console.log("Image size:", imageBase64.length, "bytes");
  console.log("Image preview:", imageBase64.substring(0, 80) + "...");
}

export function logResponse(estimate: DamageEstimate): void {
  console.log("\n=== Analysis Results ===");
  console.log("Damages detected:", estimate.damages.length);
  console.log("Total cost: $" + estimate.totalCost.toFixed(2));
  console.log("Confidence:", (estimate.confidence * 100).toFixed(1) + "%");
  console.log("Response:", JSON.stringify(estimate, null, 2));
  console.log("==============================\n");
}
