import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-3xl mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              This is a placeholder for the Privacy Policy. Please check back
              soon for the full document.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
