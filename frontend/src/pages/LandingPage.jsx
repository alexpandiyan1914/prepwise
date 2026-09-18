import React from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { ArrowRight, Code, Database, Layout, Server, Sparkles, CheckCircle } from "lucide-react";
import { DEMO_PRESETS } from "../data/sampleData";

export default function LandingPage({ onOpenDemo, onSelectPreset }) {
  const getIcon = (id) => {
    switch (id) {
      case "sde": return <Code size={22} color="#818cf8" />;
      case "frontend": return <Layout size={22} color="#38bdf8" />;
      case "data_analyst": return <Database size={22} color="#10b981" />;
      default: return <Server size={22} color="#fb923c" />;
    }
  };

  return (
    <div className="container" style={{ paddingBottom: "4rem" }}>
      <HeroSection onOpenDemo={onOpenDemo} />

      {/* Quick Test Benchmarks Preview */}
      <section style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h3 style={{ fontSize: "1.45rem", fontWeight: 800 }}>
              Live Evaluation Benchmarks
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Test how recommendations adapt dynamically between technical roles.
            </p>
          </div>

          <button onClick={onOpenDemo} className="btn btn-secondary" style={{ fontSize: "0.85rem" }}>
            <Sparkles size={15} color="var(--primary-light)" />
            View All Presets
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem"
        }}>
          {DEMO_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="card"
              onClick={() => onSelectPreset(preset)}
              style={{
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "0.625rem",
                background: "rgba(99, 102, 241, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem"
              }}>
                {getIcon(preset.id)}
              </div>

              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                {preset.title || preset.label}
              </h4>

              <div style={{ fontSize: "0.82rem", color: "var(--text-dim)", marginBottom: "1rem" }}>
                Targeting: <strong style={{ color: "var(--text-muted)" }}>{preset.company}</strong>
              </div>

              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "0.8rem",
                color: "var(--primary-light)",
                fontWeight: 600,
                borderTop: "1px solid var(--border-subtle)",
                paddingTop: "0.75rem"
              }}>
                <span>Test Live Demo</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
