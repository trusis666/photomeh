"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "@/lib/auth-context";
import UploadForm from "@/components/UploadForm";
import { formatCost } from "@/lib/estimator";
import Image from "next/image";
import type { UploadedImage } from "@/lib/types";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

export default function DashboardPage() {
  const { user, userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [uploads, setUploads] = useState<UploadedImage[]>([]);
  const [loadingUploads, setLoadingUploads] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingUploads(true);
    const q = query(
      collection(db, "damageReports"),
      where("userId", "==", user.uid),
      orderBy("uploadedAt", "desc"),
      limit(10),
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const reports: UploadedImage[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          uploadedAt: doc.data().uploadedAt,
        }));
        setUploads(reports);
        setLoadingUploads(false);
      },
      (error) => {
        console.error("Error fetching uploads:", error);
        setUploads([]);
        setLoadingUploads(false);
      },
    );
    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">PhotoMeh Dashboard</a>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                {userProfile?.photoURL ? (
                  <Image
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || "User"}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center">
                    {userProfile?.displayName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <span>{userProfile?.displayName}</span>
                <span className="text-xs">{userProfile?.email}</span>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <UploadForm />
          </div>

          {/* Stats Section */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Quick Stats</h2>
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Total Reports</div>
                    <div className="stat-value text-primary">
                      {uploads.length}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Total Estimated</div>
                    <div className="stat-value text-secondary">
                      {formatCost(
                        uploads.reduce((sum, u) => sum + u.estimatedCost, 0),
                      )}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Avg. Cost</div>
                    <div className="stat-value">
                      {uploads.length > 0
                        ? formatCost(
                            uploads.reduce(
                              (sum, u) => sum + u.estimatedCost,
                              0,
                            ) / uploads.length,
                          )
                        : "$0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Damage Reports</h2>

          {loadingUploads ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : uploads.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <p className="text-base-content/70">
                  No damage reports yet. Upload your first image to get started!
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="card bg-base-100 shadow-xl">
                  <figure className="relative h-48">
                    <Image
                      src={upload.imageUrl}
                      alt={upload.fileName}
                      fill
                      className="object-cover"
                    />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title text-sm">
                      {upload.fileName}
                      <div
                        className={`badge badge-sm ${
                          upload.status === "analyzed"
                            ? "badge-success"
                            : "badge-warning"
                        }`}
                      >
                        {upload.status}
                      </div>
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="font-bold text-primary text-lg">
                        {formatCost(upload.estimatedCost)}
                      </p>
                      <p className="text-xs text-base-content/70">
                        {new Date(upload.uploadedAt).toLocaleDateString()} at{" "}
                        {new Date(upload.uploadedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="card-actions justify-start mt-2">
                      <div className="flex flex-wrap gap-1">
                        {upload.damages.slice(0, 2).map((damage, idx) => (
                          <div
                            key={idx}
                            className="badge badge-outline badge-xs"
                          >
                            {damage}
                          </div>
                        ))}
                        {upload.damages.length > 2 && (
                          <div className="badge badge-ghost badge-xs">
                            +{upload.damages.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
