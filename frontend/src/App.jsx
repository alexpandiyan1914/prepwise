import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import RoadmapPage from "./pages/RoadmapPage";
import DemoModal from "./components/DemoModal";
import AnalysisLoader from "./components/AnalysisLoader";
import { runAnalyze } from "./services/api";

export default function App() {
  const navigate = useNavigate();

  // Load saved analysis from localStorage if present
  const [analysisData, setAnalysisData] = useState(() => {
    try {
      const saved = localStorage.getItem("prepwise_analysis");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleAnalysisSuccess = (data) => {
    setAnalysisData(data);
    try {
      localStorage.setItem("prepwise_analysis", JSON.stringify(data));
    } catch (e) {}
  };

  const handleReset = () => {
    setAnalysisData(null);
    try {
      localStorage.removeItem("prepwise_analysis");
    } catch (e) {}
  };

  // Run live demo preset
  const handleSelectPreset = async (preset) => {
    setIsDemoModalOpen(false);
    setIsProcessing(true);

    try {
      const payload = {
        student: preset.student,
        job: {
          company_name: preset.company,
          role_title: preset.role,
          raw_text: preset.jd_text,
        },
        resume_text: preset.resume_text,
      };

      const result = await runAnalyze(payload);
      handleAnalysisSuccess(result);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to run demo analysis: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar onOpenDemoModal={() => setIsDemoModalOpen(true)} />

      <main style={{ flex: 1 }}>
        {isProcessing ? (
          <AnalysisLoader />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <LandingPage
                  onOpenDemo={() => setIsDemoModalOpen(true)}
                  onSelectPreset={handleSelectPreset}
                />
              }
            />
            <Route
              path="/analyze"
              element={
                <ProfilePage
                  onAnalysisSuccess={handleAnalysisSuccess}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardPage
                  analysisData={analysisData}
                  onReset={handleReset}
                />
              }
            />
            <Route
              path="/roadmap"
              element={<RoadmapPage analysisData={analysisData} />}
            />
          </Routes>
        )}
      </main>

      {/* Demo Modal */}
      <DemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectPreset={handleSelectPreset}
        isLoading={isProcessing}
      />

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border-subtle)",
        background: "rgba(11, 15, 25, 0.95)",
        padding: "2rem 0",
        textAlign: "center",
        fontSize: "0.82rem",
        color: "var(--text-dim)"
      }}>
        <div className="container">
          <p style={{ marginBottom: "0.4rem" }}>
            <strong>PrepWise</strong> — Intelligent Personalized Placement Preparation Recommendation System
          </p>
          <p>
            An explainable MVP for placement candidates. Built with React, Flask, SQLite, and NLP semantic matching.
          </p>
        </div>
      </footer>
    </div>
  );
}
