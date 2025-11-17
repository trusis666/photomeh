export interface UploadedImage {
  id: string;
  userId: string;
  imageUrl: string; // Remote URL (Backblaze B2), not base64
  thumbnailUrl?: string;
  uploadedAt: string; // ISO string for Firestore compatibility
  estimatedCost: number;
  damages: string[];
  status: 'pending' | 'analyzed' | 'error';
  fileName: string;
}

export interface DamageEstimate {
  totalCost: number;
  damages: Array<{
    type: string;
    severity: 'minor' | 'moderate' | 'severe';
    estimatedCost: number;
    description: string;
  }>;
  laborHours: number;
  partsNeeded: string[];
  confidence: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  company?: string;
}
