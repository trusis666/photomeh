import { useState } from "react";

export function useDamageReport() {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (image: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze-damage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      });
      const data = await res.json();
      setReportData(data);
    } catch (err) {
      setError("Failed to generate report.");
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  return { reportData, loading, error, generateReport };
}
