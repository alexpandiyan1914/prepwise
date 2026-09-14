import React from "react";

export default function RecommendationFactors({ factors = {} }) {
  const factorList = [
    { key: "jd_relevance", label: "JD Relevance (30%)", val: factors.jd_relevance || 0, color: "#6366f1" },
    { key: "skill_gap", label: "Skill Gap (25%)", val: factors.skill_gap || 0, color: "#f43f5e" },
    { key: "role_importance", label: "Role Importance (20%)", val: factors.role_importance || 0, color: "#8b5cf6" },
    { key: "readiness", label: "Prereq Readiness (10%)", val: factors.readiness || 0, color: "#10b981" },
    { key: "preference", label: "User Preference (10%)", val: factors.preference || 0, color: "#06b6d4" },
    { key: "learning_history", label: "Learning History (5%)", val: factors.learning_history || 50, color: "#94a3b8" },
  ];

  return (
    <div style={{
      background: "rgba(11, 15, 25, 0.7)",
      padding: "1rem",
      borderRadius: "0.625rem",
      border: "1px solid var(--border-subtle)",
      marginTop: "0.85rem"
    }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Scoring Factor Breakdown (PRD Multi-Factor Formula)
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.85rem" }}>
        {factorList.map((f) => (
          <div key={f.key}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
              <span style={{ color: "var(--text-dim)" }}>{f.label}</span>
              <span style={{ fontWeight: 700, color: "#ffffff" }}>{Math.round(f.val)}/100</span>
            </div>
            <div style={{
              height: "5px",
              width: "100%",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "9999px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, Math.max(0, f.val))}%`,
                background: f.color,
                borderRadius: "9999px",
                transition: "width 0.8s ease"
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
