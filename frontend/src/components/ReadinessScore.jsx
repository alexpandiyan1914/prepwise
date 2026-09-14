import React from "react";
import { Award, Briefcase, Building, CheckCircle, AlertTriangle, HelpCircle, XCircle } from "lucide-react";

export default function ReadinessScore({
  score = 72,
  companyName = "Target Company",
  targetRole = "Software Development Engineer",
  metrics = { strong_count: 0, partial_count: 0, weak_count: 0, missing_count: 0 },
  nlpMethod = "Taxonomy & Semantic Vectors"
}) {
  // SVG circular gauge calculation
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 75) return "var(--status-strong)";
    if (val >= 55) return "var(--status-partial)";
    if (val >= 40) return "var(--status-weak)";
    return "var(--status-missing)";
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="card" style={{
      marginBottom: "2rem",
      background: "linear-gradient(135deg, rgba(21, 29, 47, 0.9) 0%, rgba(17, 24, 39, 0.95) 100%)",
      border: "1px solid var(--border-highlight)"
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "2rem",
        alignItems: "center"
      }}>
        {/* Left: Role Info & Readiness Score Title */}
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.25rem 0.65rem",
            borderRadius: "9999px",
            background: "rgba(99, 102, 241, 0.12)",
            color: "var(--primary-light)",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "0.75rem"
          }}>
            <Award size={14} />
            Placement Readiness Analysis
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.6rem" }}>
            {targetRole}
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Building size={16} color="var(--primary-light)" />
              {companyName}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Briefcase size={16} color="var(--accent-cyan)" />
              Target Role Alignment
            </span>
          </div>

          <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", lineHeight: 1.5 }}>
            * <strong>PrepWise Readiness Score</strong> is an MVP estimation computed from evidence alignment with target JD requirements, self-proficiency, and role-based placement weighting.
          </p>

          <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-dim)" }}>
            Engine matching strategy: <span style={{ color: "var(--text-muted)", fontWeight: 600 }}>{nlpMethod}</span>
          </div>
        </div>

        {/* Center: Radial Progress Gauge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "relative", width: "160px", height: "160px" }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="12"
              />
              {/* Progress Stroke */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={scoreColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </svg>

            {/* Value in Center */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <span style={{ fontSize: "2.4rem", fontWeight: 900, color: "#ffffff", lineHeight: 1 }}>
                {score}%
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", marginTop: "0.2rem" }}>
                Readiness
              </span>
            </div>
          </div>
        </div>

        {/* Right: Metric Summary Badges */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.75rem"
        }}>
          <div style={{
            padding: "0.85rem 1rem",
            borderRadius: "0.625rem",
            background: "var(--status-strong-bg)",
            border: "1px solid var(--status-strong-border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--status-strong)", fontWeight: 700 }}>
              <CheckCircle size={14} />
              Strong Match
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginTop: "0.2rem" }}>
              {metrics.strong_count}
            </div>
          </div>

          <div style={{
            padding: "0.85rem 1rem",
            borderRadius: "0.625rem",
            background: "var(--status-partial-bg)",
            border: "1px solid var(--status-partial-border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--status-partial)", fontWeight: 700 }}>
              <AlertTriangle size={14} />
              Partial Match
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginTop: "0.2rem" }}>
              {metrics.partial_count}
            </div>
          </div>

          <div style={{
            padding: "0.85rem 1rem",
            borderRadius: "0.625rem",
            background: "var(--status-weak-bg)",
            border: "1px solid var(--status-weak-border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--status-weak)", fontWeight: 700 }}>
              <HelpCircle size={14} />
              Weak Evidence
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginTop: "0.2rem" }}>
              {metrics.weak_count}
            </div>
          </div>

          <div style={{
            padding: "0.85rem 1rem",
            borderRadius: "0.625rem",
            background: "var(--status-missing-bg)",
            border: "1px solid var(--status-missing-border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--status-missing)", fontWeight: 700 }}>
              <XCircle size={14} />
              Missing Skills
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#ffffff", marginTop: "0.2rem" }}>
              {metrics.missing_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
