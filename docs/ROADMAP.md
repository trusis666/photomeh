# PhotoMeh - Implementation Roadmap

## Current Status ✅

- [x] Next.js 16 App Router setup
- [x] Firebase Authentication (Google OAuth)
- [x] DaisyUI + Tailwind styling
- [x] Image upload with preview
- [x] localStorage-based data persistence
- [x] Dashboard with stats
- [x] Mock damage estimation
- [x] OpenAI SDK installed
- [x] API route structure created

## Phase 1: Real AI Integration 🚀

### Task 1.1: Enable OpenAI Vision API

**Priority:** High  
**Estimated Time:** 30 minutes  
**File:** `app/api/analyze-damage/route.ts`

**Steps:**

1. Get OpenAI API key from https://platform.openai.com/api-keys
2. Add to `.env.local`: `OPENAI_API_KEY=sk-proj-...`
3. Replace lines 26-56 in `route.ts` with real API call (see `docs/OPENAI_INTEGRATION.md`)
4. Test with real vehicle damage photo
5. Monitor console logs for AI responses

**Success Criteria:**

- AI returns structured damage estimates
- Console shows actual AI analysis
- UI displays real damage types and costs

**Reference:** `docs/OPENAI_INTEGRATION.md`

---

### Task 1.2: Add Image Optimization

**Priority:** Medium  
**Estimated Time:** 45 minutes  
**File:** `components/UploadForm.tsx`

**Why:** Reduce API costs by resizing images before analysis

**Implementation:**

```typescript
// Add before line 62 (before calling estimateDamage)
const resizedImage = await resizeImage(previewUrl || '', 1024);
const damageEstimate = await estimateDamage(resizedImage);
```

**Add helper function:**

```typescript
async function resizeImage(base64: string, maxWidth = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = base64;
  });
}
```

---

### Task 1.3: Add Confidence Score Display

**Priority:** Low  
**Estimated Time:** 20 minutes  
**Files:** `components/UploadForm.tsx`

**Add to estimate display section (around line 195):**

```tsx
<div className="stat">
  <div className="stat-title">AI Confidence</div>
  <div className="stat-value text-2xl">
    {(estimate.confidence * 100).toFixed(0)}%
  </div>
  <div className="stat-desc">
    {estimate.confidence >= 0.8
      ? 'High confidence'
      : estimate.confidence >= 0.6
      ? 'Moderate confidence'
      : 'Low confidence - manual review recommended'}
  </div>
</div>
```

---

## Phase 2: Firebase Storage Integration 🗄️

### Task 2.1: Upload Images to Firebase Storage

**Priority:** Medium  
**Estimated Time:** 1 hour  
**File:** `components/UploadForm.tsx`

**Current:** Images stored as base64 in localStorage  
**Goal:** Upload to Firebase Storage, store URLs

**Implementation:**

```typescript
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {storage} from '@/lib/firebase';

// Replace localStorage image storage (around line 62)
const storageRef = ref(
  storage,
  `damage-photos/${user.uid}/${Date.now()}-${selectedFile.name}`,
);
const snapshot = await uploadBytes(storageRef, selectedFile);
const downloadURL = await getDownloadURL(snapshot.ref);

// Use downloadURL instead of previewUrl for storage
```

**Benefits:**

- Unlimited storage capacity
- Proper image hosting
- Shareable URLs

---

### Task 2.2: Migrate to Firestore Database

**Priority:** Medium  
**Estimated Time:** 1.5 hours  
**Files:** `components/UploadForm.tsx`, `app/dashboard/page.tsx`

**Current:** localStorage (50 report limit, browser-only)  
**Goal:** Firestore (unlimited, cross-device)

**Schema:**

```typescript
// Collection: damage-reports
{
  id: string;
  userId: string;
  imageUrl: string;
  fileName: string;
  uploadedAt: Timestamp;
  estimatedCost: number;
  damages: Array<{
    type: string;
    severity: string;
    estimatedCost: number;
    description: string;
  }>;
  laborHours: number;
  confidence: number;
  status: 'pending' | 'analyzed' | 'approved' | 'rejected';
}
```

**Implementation in UploadForm.tsx:**

```typescript
import {collection, addDoc, serverTimestamp} from 'firebase/firestore';
import {db} from '@/lib/firebase';

// Replace localStorage.setItem (around line 72)
await addDoc(collection(db, 'damage-reports'), {
  userId: user.uid,
  imageUrl: downloadURL,
  fileName: selectedFile.name,
  uploadedAt: serverTimestamp(),
  estimatedCost: damageEstimate.totalCost,
  damages: damageEstimate.damages,
  laborHours: damageEstimate.laborHours,
  confidence: damageEstimate.confidence,
  status: 'analyzed',
});
```

**Implementation in dashboard/page.tsx:**

```typescript
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from 'firebase/firestore';

useEffect(() => {
  if (!user) return;

  const q = query(
    collection(db, 'damage-reports'),
    where('userId', '==', user.uid),
    orderBy('uploadedAt', 'desc'),
    limit(10),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      uploadedAt: doc.data().uploadedAt?.toDate(),
    }));
    setUploads(reports as UploadedImage[]);
  });

  return () => unsubscribe();
}, [user]);
```

---

## Phase 3: Enhanced Features ✨

### Task 3.1: Multi-Photo Analysis

**Priority:** Low  
**Estimated Time:** 2 hours

Allow uploading multiple angles of same vehicle for better accuracy.

---

### Task 3.2: Export to PDF

**Priority:** Low  
**Estimated Time:** 1.5 hours

Generate PDF reports with damage photos and cost breakdown.

**Libraries:** `jsPDF`, `html2canvas`

---

### Task 3.3: Admin Dashboard

**Priority:** Low  
**Estimated Time:** 3 hours

Create admin interface to:

- Review all estimates
- Approve/reject analyses
- Override AI estimates
- Track accuracy metrics

---

### Task 3.4: Email Notifications

**Priority:** Low  
**Estimated Time:** 1 hour

Send email when:

- Analysis is complete
- Cost exceeds threshold
- Manual review needed

**Service:** Firebase Cloud Functions + SendGrid/Resend

---

## Phase 4: Production Readiness 🚀

### Task 4.1: Error Boundary Components

**Priority:** High  
**Estimated Time:** 1 hour

Add React Error Boundaries for graceful failures.

---

### Task 4.2: Loading States & Skeletons

**Priority:** Medium  
**Estimated Time:** 1 hour

Replace spinners with skeleton screens for better UX.

---

### Task 4.3: Analytics Integration

**Priority:** Medium  
**Estimated Time:** 30 minutes

Add Google Analytics or Vercel Analytics.

---

### Task 4.4: Rate Limiting

**Priority:** High  
**Estimated Time:** 1 hour

Prevent API abuse:

- Limit uploads per user (e.g., 10/day)
- Add cooldown between analyses
- Track usage in Firestore

---

### Task 4.5: Security Rules

**Priority:** Critical  
**Estimated Time:** 30 minutes

**Firestore Rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /damage-reports/{reportId} {
      allow read: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId
        && request.resource.data.uploadedAt == request.time;
      allow update: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

**Storage Rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /damage-photos/{userId}/{fileName} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 10 * 1024 * 1024 // 10MB limit
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## Testing Checklist

- [ ] Upload vehicle damage photo → AI analyzes correctly
- [ ] Upload non-vehicle photo → Returns confidence 0
- [ ] Upload while offline → Shows error message
- [ ] Multiple uploads in succession → All saved correctly
- [ ] Logout/login → Data persists
- [ ] Large file (>10MB) → Shows validation error
- [ ] Dashboard real-time updates when new upload added
- [ ] Mobile responsive on iPhone/Android
- [ ] Dark mode works correctly

---

## Deployment

### Vercel Setup

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
OPENAI_API_KEY=sk-proj-...
```

---

## Cost Estimates

**Monthly Costs (100 users, 5 uploads each):**

- OpenAI GPT-4 Vision: ~$15-30 (500 analyses)
- Firebase Storage: $0.026/GB (~$0.50 for images)
- Firebase Firestore: Free tier (50k reads, 20k writes)
- Vercel Hosting: Free tier sufficient

**Total:** ~$15-30/month for 500 analyses

---

## Quick Reference

**Start Dev:** `npm run dev`  
**Build:** `npm run build`  
**Lint:** `npm run lint`

**Key Files:**

- API Route: `app/api/analyze-damage/route.ts`
- Upload Form: `components/UploadForm.tsx`
- Dashboard: `app/dashboard/page.tsx`
- Auth Context: `lib/auth-context.tsx`
- Types: `lib/types.ts`

**Documentation:**

- OpenAI Integration: `docs/OPENAI_INTEGRATION.md`
- Project Instructions: `.github/copilot-instructions.md`
