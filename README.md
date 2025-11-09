# PhotoMeh - Auto Insurance Damage Estimator

A Next.js 16 web application built for insurance companies to upload images of damaged vehicles and automatically estimate repair costs using AI.

## 🚀 Tech Stack

- **Framework:** Next.js 16.0.0 (App Router)
- **Authentication:** Firebase Auth with Google provider
- **Database:** Cloud Firestore
- **Storage:** Firebase Storage
- **Styling:** Tailwind CSS + DaisyUI
- **Language:** TypeScript
- **Deployment:** Vercel-ready

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth via Firebase
- 📸 **Image Upload** - Upload damage photos to Firebase Storage
- 🤖 **AI Estimation** - Mock damage detection and cost estimation (API-ready)
- 📊 **Dashboard** - View recent uploads and cost statistics
- 🎨 **Modern UI** - DaisyUI components with responsive design
- 🔒 **Protected Routes** - Middleware-based authentication
- 📱 **Responsive** - Mobile-friendly interface

## 🏗️ Project Structure

```
photomeh/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Google login page
│   ├── dashboard/
│   │   └── page.tsx              # Main dashboard with uploads
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles with Tailwind
├── components/
│   └── UploadForm.tsx            # Image upload component
├── lib/
│   ├── firebase.ts               # Firebase configuration
│   ├── auth-context.tsx          # Authentication context
│   ├── estimator.ts              # Damage estimation logic
│   └── types.ts                  # TypeScript types
├── middleware.ts                 # Route protection
├── tailwind.config.ts            # Tailwind + DaisyUI config
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Google Authentication** in Firebase Console
3. Enable **Cloud Firestore** database
4. Enable **Firebase Storage**
5. Copy your Firebase config

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firebase Security Rules

#### Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /damage-reports/{reportId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /damage-images/{userId}/{imageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

### User Flow

1. **Login** - Navigate to `/login` and sign in with Google
2. **Upload** - On the dashboard, upload a photo of vehicle damage
3. **Analyze** - The system analyzes the image and estimates repair costs
4. **Review** - View detailed damage breakdown and cost estimate
5. **History** - Access previous uploads in the dashboard

### Key Components

#### UploadForm Component

```tsx
import UploadForm from '@/components/UploadForm';

// Use in your page
<UploadForm />;
```

Features:

- Image preview before upload
- Progress indicator
- Real-time cost estimation
- Damage severity badges

#### Authentication Hook

```tsx
import {useAuth} from '@/lib/auth-context';

const {user, userProfile, signInWithGoogle, logout} = useAuth();
```

#### Cost Estimation

```tsx
import {estimateDamage, formatCost} from '@/lib/estimator';

const estimate = await estimateDamage(imageUrl);
const formatted = formatCost(estimate.totalCost);
```

## 🎨 Customization

### DaisyUI Themes

Edit `tailwind.config.ts` to change themes:

```typescript
daisyui: {
  themes: ["light", "dark", "cupcake", "corporate"],
}
```

### Mock Estimation Logic

Replace the mock logic in `lib/estimator.ts` with your AI service:

```typescript
export async function estimateDamage(imageUrl: string) {
  // Call your ML API here
  const response = await fetch('your-ai-api.com/estimate', {
    method: 'POST',
    body: JSON.stringify({imageUrl}),
  });
  return response.json();
}
```

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
npm run build
```

## 📝 API Integration

The app is designed to easily integrate with AI services:

1. Replace `lib/estimator.ts` mock function
2. Add your API endpoint
3. Update the `DamageEstimate` type if needed
4. Add API keys to `.env.local`

## 🔒 Security Features

- ✅ Firebase Authentication
- ✅ Middleware route protection
- ✅ User-scoped data access
- ✅ Secure file uploads
- ✅ Environment variable protection

## 🐛 Troubleshooting

### TypeScript Errors

The initial TypeScript errors are expected before installing dependencies. Run:

```bash
npm install
```

### Firebase Connection Issues

Verify your `.env.local` file has correct Firebase credentials.

### Image Upload Fails

Check Firebase Storage rules and ensure bucket permissions are set correctly.

## 📄 License

MIT License - feel free to use this project for your insurance company!

## 🤝 Contributing

This project was scaffolded as a complete starter. Feel free to extend and customize!

---

**Built with ❤️ using Next.js 16, Firebase, and DaisyUI**
