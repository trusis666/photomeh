'use client';

import {useState, useRef, ChangeEvent} from 'react';
import {useAuth} from '@/lib/auth-context';
import {estimateDamage, formatCost, getSeverityColor} from '@/lib/estimator';
import type {DamageEstimate} from '@/lib/types';
import Image from 'next/image';

export default function UploadForm() {
  const {user} = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [estimate, setEstimate] = useState<DamageEstimate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setEstimate(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setError(null);

    try {
      // Simulate upload progress for local storage
      setUploadProgress(30);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(60);
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(100);

      setUploading(false);
      setAnalyzing(true);

      // Run damage estimation using the preview URL (base64)
      const damageEstimate = await estimateDamage(previewUrl || '');
      setEstimate(damageEstimate);

      // Store locally in browser's localStorage
      const localData = {
        id: Date.now().toString(),
        userId: user.uid,
        imageUrl: previewUrl, // base64 data URL
        fileName: selectedFile.name,
        uploadedAt: new Date().toISOString(),
        estimatedCost: damageEstimate.totalCost,
        damages: damageEstimate.damages.map((d) => d.type),
        laborHours: damageEstimate.laborHours,
        confidence: damageEstimate.confidence,
        status: 'analyzed',
      };

      // Get existing reports from localStorage
      const existingReports = localStorage.getItem('damage-reports');
      const reports = existingReports ? JSON.parse(existingReports) : [];
      reports.unshift(localData); // Add new report at the beginning

      // Keep only last 50 reports to avoid localStorage limits
      if (reports.length > 50) {
        reports.splice(50);
      }

      localStorage.setItem('damage-reports', JSON.stringify(reports));

      // Dispatch custom event to notify dashboard to refresh
      window.dispatchEvent(new Event('damageReportAdded'));

      setAnalyzing(false);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred. Please try again.');
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEstimate(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Upload Damage Photo</h2>
        <p className="text-sm text-base-content/70">
          Upload a clear photo of the damaged vehicle to get an instant repair
          cost estimate
        </p>

        {error && (
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select Image</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input file-input-bordered file-input-primary w-full"
            disabled={uploading || analyzing}
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Preview</span>
            </label>
            <div className="relative w-full h-64 bg-base-200 rounded-lg overflow-hidden">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}

        {uploading && (
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Uploading...</span>
              <span className="label-text-alt">{uploadProgress}%</span>
            </label>
            <progress
              className="progress progress-primary w-full"
              value={uploadProgress}
              max="100"
            ></progress>
          </div>
        )}

        {analyzing && (
          <div className="alert alert-info mt-4">
            <span className="loading loading-spinner"></span>
            <span>Analyzing damage and calculating costs...</span>
          </div>
        )}

        {estimate && (
          <div className="mt-4 space-y-4">
            <div className="divider">Estimate Results</div>

            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Cost</div>
                <div className="stat-value text-primary">
                  {formatCost(estimate.totalCost)}
                </div>
                <div className="stat-desc">Estimated repair cost</div>
              </div>
              <div className="stat">
                <div className="stat-title">Labor Hours</div>
                <div className="stat-value">{estimate.laborHours}h</div>
                <div className="stat-desc">Professional service time</div>
              </div>
              <div className="stat">
                <div className="stat-title">Confidence</div>
                <div className="stat-value">
                  {Math.round(estimate.confidence * 100)}%
                </div>
                <div className="stat-desc">Analysis accuracy</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Detected Damages</h3>
              <div className="space-y-2">
                {estimate.damages.map((damage, index) => (
                  <div key={index} className="card bg-base-200">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{damage.type}</h4>
                          <p className="text-sm text-base-content/70">
                            {damage.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`badge ${getSeverityColor(
                              damage.severity,
                            )} mb-1`}
                          >
                            {damage.severity}
                          </div>
                          <div className="font-bold">
                            {formatCost(damage.estimatedCost)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2">Parts Needed</h3>
              <div className="flex flex-wrap gap-2">
                {estimate.partsNeeded.map((part, index) => (
                  <div key={index} className="badge badge-outline">
                    {part}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-4">
          {estimate ? (
            <button onClick={handleReset} className="btn btn-primary">
              Upload Another
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="btn btn-ghost"
                disabled={!selectedFile || uploading || analyzing}
              >
                Clear
              </button>
              <button
                onClick={handleUpload}
                className="btn btn-primary"
                disabled={!selectedFile || uploading || analyzing}
              >
                {uploading
                  ? 'Uploading...'
                  : analyzing
                  ? 'Analyzing...'
                  : 'Analyze Damage'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
