import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to <span className="text-primary">PhotoMeh</span>
          </h1>
          <p className="text-xl mb-8">
            AI-Powered Auto Damage Assessment & Cost Estimation
          </p>
          <p className="py-6 text-lg">
            Upload photos of damaged vehicles and get instant, accurate repair
            cost estimates powered by advanced machine learning. Streamline your
            insurance claims process today.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Go to Dashboard
            </Link>
          </div>
          <div className="mt-12 stats shadow">
            <div className="stat">
              <div className="stat-title">Avg. Analysis Time</div>
              <div className="stat-value text-primary">2 sec</div>
            </div>
            <div className="stat">
              <div className="stat-title">Accuracy</div>
              <div className="stat-value text-secondary">95%</div>
            </div>
            <div className="stat">
              <div className="stat-title">Cost Savings</div>
              <div className="stat-value">40%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
