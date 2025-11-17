"use client";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);

  // Mock report data
  const mockReport = {
    severity: "Moderate",
    cost: "€1,200",
    labor: "6 hours",
    parts: "Front bumper, headlight",
    confidence: "90%",
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("Max file size is 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setShowReport(true);
    };
    reader.readAsDataURL(file);
  };

  const handleStripePay = () => {
    // Placeholder: Replace with Stripe Checkout integration
    alert("Stripe payment flow goes here.");
  };

  return (
    <div className="min-h-screen hero bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl w-full">
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
          <div className="flex gap-4 justify-center mb-8">
            <Link href="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link href="/dashboard" className="btn btn-outline btn-lg">
              Go to Dashboard
            </Link>
          </div>

          {/* Guest image upload and report preview */}
          <div className="bg-base-100 rounded-xl p-6 shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Try Demo (Guest)</h2>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full max-w-xs mb-4"
              onChange={handleImageUpload}
            />
            {image && (
              <div className="flex flex-col items-center">
                <img
                  src={image}
                  alt="Preview"
                  className="rounded-lg shadow mb-4 max-h-64"
                  style={{ objectFit: "contain" }}
                />
                {showReport && (
                  <div className="card w-full bg-base-200 shadow mb-4">
                    <div className="card-body">
                      <h3 className="card-title mb-2">Damage Report Preview</h3>
                      <ul className="text-left mb-4">
                        <li>
                          <b>Severity:</b> {mockReport.severity}
                        </li>
                        <li>
                          <b>Estimated Cost:</b> {mockReport.cost}
                        </li>
                        <li>
                          <b>Labor:</b> {mockReport.labor}
                        </li>
                        <li>
                          <b>Parts:</b> {mockReport.parts}
                        </li>
                        <li>
                          <b>Confidence:</b> {mockReport.confidence}
                        </li>
                      </ul>
                      <button
                        className="btn btn-success btn-lg"
                        onClick={handleStripePay}
                      >
                        Pay €2 to Unlock Full Report
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
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
