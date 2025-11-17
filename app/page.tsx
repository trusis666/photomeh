"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useDamageReport } from "../lib/useDamageReport";

const StripePaymentWidget = dynamic(
  () => import("../components/StripePaymentWidget"),
  { ssr: false },
);
export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [finalReport, setFinalReport] = useState(false);
  const [paymentRedirect, setPaymentRedirect] = useState(false);
  const {
    reportData,
    loading: reportLoading,
    error: reportError,
    generateReport,
  } = useDamageReport();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("redirect_status") === "succeeded") {
        // Restore image from localStorage
        const imageData = localStorage.getItem("photomeh-upload-image");
        if (imageData) {
          setImage(imageData);
          setPaymentRedirect(true);
          setGenerating(true);
          // Actually generate report
          generateReport(imageData)
            .then(() => {
              setGenerating(false);
              setFinalReport(true);
              localStorage.removeItem("photomeh-upload-image");
            })
            .catch(() => {
              setGenerating(false);
              setFinalReport(true);
              localStorage.removeItem("photomeh-upload-image");
            });
        }
      }
    }
  }, []);

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
      // Save image to localStorage for post-payment restore
      if (typeof window !== "undefined") {
        localStorage.setItem("photomeh-upload-image", reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleStripePay = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      if (data.url) {
        // Image already saved to localStorage above
        window.location.href = data.url;
      } else {
        alert("Stripe session error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Stripe payment error: " + err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-12">
        <div className="max-w-2xl w-full text-center">
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
          {/* Guest image upload and report preview */}
          <div className="bg-base-100 rounded-xl p-6 shadow mb-8 mx-auto w-full max-w-xl">
            <p className="mb-4 text-base text-center">
              Upload a photo of your damaged vehicle below. You’ll see a preview
              of the AI-generated damage report instantly.
            </p>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full max-w-xs mb-4"
              onChange={handleImageUpload}
            />
            {image && !paymentRedirect && (
              <div className="flex flex-col items-center">
                <img
                  src={image}
                  alt="Preview"
                  className="rounded-lg shadow mb-4 max-h-64"
                  style={{ objectFit: "contain" }}
                />
                {showReport && !generating && !finalReport && (
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
                      <div className="mt-4">
                        <StripePaymentWidget
                          onSuccess={() => {
                            setGenerating(true);
                            setTimeout(() => {
                              setGenerating(false);
                              setFinalReport(true);
                            }, 2500);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {(generating || paymentRedirect) && (
              <div className="flex flex-col items-center justify-center w-full py-12">
                <span className="loading loading-spinner loading-lg mb-4"></span>
                <div className="text-lg font-semibold">
                  Generating your full report...
                </div>
              </div>
            )}
            {finalReport && (
              <div className="card w-full bg-base-200 shadow mb-4">
                <div className="card-body">
                  <h3 className="card-title mb-2">Your Full Damage Report</h3>
                  {reportData && !reportError ? (
                    <ul className="text-left mb-4">
                      <li>
                        <b>Severity:</b> {reportData.severity}
                      </li>
                      <li>
                        <b>Estimated Cost:</b> €{reportData.estimatedCost}
                      </li>
                      <li>
                        <b>Labor:</b> {reportData.laborHours} hours
                      </li>
                      <li>
                        <b>Parts:</b> {reportData.partsNeeded?.join(", ")}
                      </li>
                      <li>
                        <b>Confidence:</b>{" "}
                        {Math.round(reportData.confidence * 100)}%
                      </li>
                    </ul>
                  ) : (
                    <div className="text-error mb-4">
                      {reportError || "No report data."}
                    </div>
                  )}
                  <div className="flex gap-4 mt-4 justify-center">
                    <button
                      className="btn btn-primary"
                      onClick={() => window.print()}
                    >
                      Download PDF
                    </button>
                    <button
                      className="btn btn-outline"
                      onClick={() =>
                        navigator.share
                          ? navigator.share({
                              title: "PhotoMeh Damage Report",
                              text: "See my AI-generated damage report!",
                              url: window.location.href,
                            })
                          : alert("Share not supported on this device.")
                      }
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-12 stats shadow mx-auto w-full max-w-xl">
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
      </main>
      <Footer />
    </div>
  );
}
