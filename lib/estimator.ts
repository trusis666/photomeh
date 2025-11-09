import type {DamageEstimate} from './types';

/**
 * Estimate damage using OpenAI Vision API
 * Sends image to the API endpoint which calls GPT-4 Vision
 */
export async function estimateDamage(
  imageUrl: string,
): Promise<DamageEstimate> {
  try {
    const response = await fetch('/api/analyze-damage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: imageUrl,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || 'Failed to analyze damage');
    }

    const estimate: DamageEstimate = await response.json();
    return estimate;
  } catch (error) {
    console.error('Error estimating damage:', error);
    // Return a fallback estimate on error
    return {
      totalCost: 0,
      damages: [],
      laborHours: 0,
      partsNeeded: [],
      confidence: 0,
    };
  }
}

/**
 * Get severity color for UI
 */
export function getSeverityColor(
  severity: 'minor' | 'moderate' | 'severe',
): string {
  switch (severity) {
    case 'minor':
      return 'badge-success';
    case 'moderate':
      return 'badge-warning';
    case 'severe':
      return 'badge-error';
    default:
      return 'badge-ghost';
  }
}

/**
 * Format cost as currency
 */
export function formatCost(cost: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cost);
}
