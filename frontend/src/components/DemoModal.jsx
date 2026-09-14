import React from "react";
import { X, Sparkles, ArrowRight, Code, Database, Layout, Server } from "lucide-react";
import { DEMO_PRESETS } from "../data/sampleData";

export default function DemoModal({ isOpen, onClose, onSelectPreset, isLoading }) {
  if (!isOpen) return null;

  const getIcon = (id) => {
    switch (id) {
      case "sde": return <Code size={20} color="#818cf8" />;
      case "frontend": return <Layout size={20} color="#38bdf8" />;
      case "data_analyst": return <Database size={20} color="#10b981" />;
      default: return <Server size={20} color="#fb923c" />;
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      padding: "1rem"
    }}>
      <div style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-highlight)",
        borderRadius: "1rem",
        maxWidth: "640px",
        width: "100%",
        padding: "2rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6)",
        position: "relative"
      }} className="animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "transparent",
            border: "none",
            color: "var(--text-dim)",
            cursor: "pointer"
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <Sparkles size={20} color="var(--primary-light)" />
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800 }}>
            Select a Placement Benchmark Demo
          </h3>
        </div>

        <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
          Test PrepWise end-to-end instantly without manual uploads. The recommendation engine dynamically computes real scores for each target role.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {DEMO_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => !isLoading && onSelectPreset(preset)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                borderRadius: "0.625rem",
                background: "var(--bg-card)",
                border: "1px solid var(--border-subtle)",
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.borderColor = "var(--border-subtle)";
                  e.currentTarget.style.transform = "translateX(0)";
                }
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "0.5rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {getIcon(preset.id)}
                </div>

                <div>
                  <h4 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#ffffff" }}>
                    {preset.title || preset.label}
                  </h4>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.15rem" }}>
                    Student: <strong style={{ color: "var(--text-muted)" }}>{preset.student.name}</strong> • Target: <strong style={{ color: "var(--primary-light)" }}>{preset.role}</strong> ({preset.company})
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isLoading}
                className="btn btn-secondary"
                style={{ padding: "0.4rem 0.85rem", fontSize: "0.78rem" }}
              >
                Run Live
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
