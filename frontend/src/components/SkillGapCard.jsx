import React from "react";
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle, FileText, Target } from "lucide-react";

export default function SkillGapCard({ gap }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case "STRONG_MATCH": return "badge badge-strong";
      case "PARTIAL_MATCH": return "badge badge-partial";
      case "WEAK": return "badge badge-weak";
      default: return "badge badge-missing";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "STRONG_MATCH": return <CheckCircle2 size={13} />;
      case "PARTIAL_MATCH": return <AlertTriangle size={13} />;
      case "WEAK": return <HelpCircle size={13} />;
      default: return <XCircle size={13} />;
    }
  };

  const matchPercent = Math.round((gap.similarity_score || 0) * 100);

  return (
    <div className="card" style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderLeft: `4px solid ${
        gap.status === "STRONG_MATCH" ? "var(--status-strong)" :
        gap.status === "PARTIAL_MATCH" ? "var(--status-partial)" :
        gap.status === "WEAK" ? "var(--status-weak)" : "var(--status-missing)"
      }`
    }}>
      <div>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.15rem" }}>
              {gap.skill_name}
            </h4>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
              {gap.is_required ? "Explicitly Required" : "Preferred Competency"}
            </div>
          </div>

          <span className={getBadgeClass(gap.status)}>
            {getStatusIcon(gap.status)}
            {gap.status.replace("_", " ")}
          </span>
        </div>

        {/* Level and Match Progress Bar */}
        <div style={{
          background: "var(--bg-surface)",
          padding: "0.6rem 0.75rem",
          borderRadius: "0.5rem",
          marginBottom: "0.85rem",
          fontSize: "0.8rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Match Alignment</span>
            <span style={{ fontWeight: 700, color: "#ffffff" }}>{matchPercent}%</span>
          </div>

          <div style={{
            height: "5px",
            width: "100%",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.1)",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${matchPercent}%`,
              background: gap.status === "STRONG_MATCH" ? "var(--status-strong)" :
                          gap.status === "PARTIAL_MATCH" ? "var(--status-partial)" :
                          gap.status === "WEAK" ? "var(--status-weak)" : "var(--status-missing)",
              borderRadius: "9999px"
            }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.45rem", fontSize: "0.72rem", color: "var(--text-dim)" }}>
            <span>Resume Level: <strong style={{ color: "var(--text-main)" }}>{gap.student_level || 0}/5</strong></span>
            <span>Required Level: <strong style={{ color: "var(--text-main)" }}>{gap.required_level || 4}/5</strong></span>
          </div>
        </div>

        {/* Evidence Snippet */}
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 600, color: "var(--primary-light)", marginBottom: "0.2rem" }}>
            <FileText size={13} />
            Student Resume Evidence:
          </div>
          <div style={{
            fontStyle: "italic",
            background: "rgba(11, 15, 25, 0.5)",
            padding: "0.35rem 0.5rem",
            borderRadius: "0.375rem",
            borderLeft: "2px solid var(--border-subtle)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
          }}>
            "{gap.student_evidence || "No mention found in resume."}"
          </div>
        </div>

        {/* JD Requirement Snippet */}
        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontWeight: 600, color: "var(--accent-cyan)", marginBottom: "0.2rem" }}>
            <Target size={13} />
            Target JD Requirement:
          </div>
          <div style={{
            background: "rgba(11, 15, 25, 0.5)",
            padding: "0.35rem 0.5rem",
            borderRadius: "0.375rem",
            borderLeft: "2px solid var(--border-subtle)",
            wordBreak: "break-word"
          }}>
            "{gap.jd_requirement}"
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        fontSize: "0.75rem",
        color: "var(--text-dim)",
        borderTop: "1px solid var(--border-subtle)",
        paddingTop: "0.5rem"
      }}>
        {gap.explanation}
      </div>
    </div>
  );
}
