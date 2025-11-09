import type {DamageEstimate} from './types';

/**
 * Mock damage estimation function
 * In production, this would call an AI service or ML model
 */
export async function estimateDamage(
  imageUrl: string,
): Promise<DamageEstimate> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate mock estimate based on random factors
  const damageTypes = [
    {
      type: 'Front Bumper Damage',
      severity: 'moderate' as const,
      estimatedCost: Math.floor(Math.random() * 800) + 400,
      description: 'Impact damage with visible cracks and deformation',
    },
    {
      type: 'Hood Dent',
      severity: 'minor' as const,
      estimatedCost: Math.floor(Math.random() * 400) + 200,
      description: 'Minor dent requiring paintless dent repair',
    },
    {
      type: 'Headlight Replacement',
      severity: 'severe' as const,
      estimatedCost: Math.floor(Math.random() * 600) + 300,
      description: 'Broken headlight assembly needs complete replacement',
    },
    {
      type: 'Paint Scratches',
      severity: 'minor' as const,
      estimatedCost: Math.floor(Math.random() * 300) + 150,
      description: 'Surface scratches requiring repainting',
    },
    {
      type: 'Fender Damage',
      severity: 'moderate' as const,
      estimatedCost: Math.floor(Math.random() * 700) + 500,
      description: 'Deformed fender panel requires replacement',
    },
  ];

  // Randomly select 1-3 damage types
  const numDamages = Math.floor(Math.random() * 3) + 1;
  const selectedDamages = damageTypes
    .sort(() => Math.random() - 0.5)
    .slice(0, numDamages);

  const totalCost = selectedDamages.reduce(
    (sum, damage) => sum + damage.estimatedCost,
    0,
  );
  const laborHours = Math.ceil(totalCost / 100);
  const partsNeeded = selectedDamages.map((d) => d.type.split(' ')[0]);

  return {
    totalCost,
    damages: selectedDamages,
    laborHours,
    partsNeeded,
    confidence: Math.random() * 0.2 + 0.75, // 75-95% confidence
  };
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
