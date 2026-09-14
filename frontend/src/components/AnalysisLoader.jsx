import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";

export default function AnalysisLoader({ onComplete }) {
  const steps = [
    "Reading and parsing uploaded resume...",
    "Extracting technical competencies & project evidence...",
    "Analyzing target company job description (JD)...",
    "Normalizing skills via structured placement taxonomy...",
    "Performing semantic vector similarity matching...",
    "Calculating skill gaps (Strong, Partial, Weak, Missing)...",
    "Evaluating aggregate PrepWise Readiness Score...",
    "Running multi-factor weighted recommendation engine...",
    "Synthesizing customized 5-day placement preparation roadmap..."
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div style={{
      maxWidth: "560px",
      margin: "4rem auto",
      padding: "2.5rem",
      borderRadius: "1rem",
      background: "var(--bg-card)",
      border: "1px solid var(--border-highlight)",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
      textAlign: "center"
    }} className="animate-fade-in">
      <div style={{
        width: "3.5rem",
        height: "3.5rem",
        borderRadius: "1rem",
        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 1.25rem auto",
        boxShadow: "0 0 24px rgba(99, 102, 241, 0.4)"
      }}>
        <Sparkles size={28} color="#ffffff" />
      </div>

      <h2 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "0.5rem" }}>
        Analyzing Your Placement Profile
      </h2>
      <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "2rem" }}>
        PrepWise is extracting skills, calculating competency gaps, and generating explainable priorities.
      </p>

      {/* Progress Checklist */}
      <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
        {steps.map((text, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.375rem",
                background: isCurrent ? "rgba(99, 102, 241, 0.1)" : "transparent",
                border: isCurrent ? "1px solid rgba(99, 102, 241, 0.25)" : "1px solid transparent",
                transition: "all 0.2s ease"
              }}
            >
              {isDone ? (
                <CheckCircle2 size={18} color="var(--status-strong)" style={{ flexShrink: 0 }} />
              ) : isCurrent ? (
                <Loader2 size={18} color="var(--primary-light)" className="spin" style={{ flexShrink: 0, animation: "spin 1s linear infinite" }} />
              ) : (
                <Circle size={18} color="var(--text-dim)" style={{ flexShrink: 0 }} />
              )}

              <span style={{
                fontSize: "0.85rem",
                fontWeight: isCurrent ? 700 : 500,
                color: isDone ? "#ffffff" : isCurrent ? "var(--primary-light)" : "var(--text-dim)"
              }}>
                {text}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
