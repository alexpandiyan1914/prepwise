import React, { useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, BookOpen, Clock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import RecommendationFactors from "./RecommendationFactors";
import ResourceCard from "./ResourceCard";

export default function RecommendationCard({ recommendation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "VERY HIGH": return "priority-pill priority-very-high";
      case "HIGH": return "priority-pill priority-high";
      case "MEDIUM": return "priority-pill priority-medium";
      default: return "priority-pill priority-low";
    }
  };

  const getPrereqBadge = (status) => {
    if (status === "Ready") {
      return (
        <span style={{ fontSize: "0.72rem", color: "var(--status-strong)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
          <ShieldCheck size={14} />
          Prerequisites: Ready
        </span>
      );
    }
    if (status === "Partially Ready") {
      return (
        <span style={{ fontSize: "0.72rem", color: "var(--status-partial)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
          <ShieldCheck size={14} />
          Prerequisites: Partially Ready
        </span>
      );
    }
    return (
      <span style={{ fontSize: "0.72rem", color: "var(--status-missing)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
        <ShieldCheck size={14} />
        Prerequisites: Needs Foundation
      </span>
    );
  };

  const resources = recommendation.resources || [];

  return (
    <div className="card" style={{
      marginBottom: "1.25rem",
      border: recommendation.rank === 1 ? "1px solid var(--border-active)" : "1px solid var(--border-subtle)",
      boxShadow: recommendation.rank === 1 ? "0 8px 24px rgba(59, 130, 246, 0.15)" : "var(--shadow-md)",
      background: recommendation.rank === 1 ? "linear-gradient(135deg, rgba(28, 38, 60, 0.95) 0%, rgba(21, 29, 47, 0.9) 100%)" : "var(--bg-card)"
    }}>
      {/* Top Banner Row */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        marginBottom: "0.75rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Rank Badge */}
          <div style={{
            width: "2.25rem",
            height: "2.25rem",
            borderRadius: "0.5rem",
            background: recommendation.rank === 1 ? "linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)" : "rgba(255, 255, 255, 0.08)",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: 800
          }}>
            #{recommendation.rank}
          </div>

          <div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {recommendation.skill_name}
              {recommendation.rank === 1 && (
                <span style={{ fontSize: "0.72rem", background: "rgba(244, 63, 94, 0.2)", color: "#f43f5e", padding: "0.15rem 0.5rem", borderRadius: "9999px", fontWeight: 700 }}>
                  Top Priority
                </span>
              )}
            </h3>
            <div style={{ fontSize: "0.76rem", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>Gap Status: <strong style={{ color: "var(--text-muted)" }}>{recommendation.gap_level}</strong></span>
              <span>•</span>
              {getPrereqBadge(recommendation.prerequisite_status)}
            </div>
          </div>
        </div>

        {/* Priority & Score */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <span className={getPriorityClass(recommendation.priority)}>
            {recommendation.priority}
          </span>

          <div style={{
            textAlign: "right",
            padding: "0.35rem 0.75rem",
            background: "rgba(11, 15, 25, 0.6)",
            borderRadius: "0.375rem",
            border: "1px solid var(--border-subtle)"
          }}>
            <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase" }}>
              Prep Score
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--primary-light)", lineHeight: 1 }}>
              {recommendation.score}<span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Action / What to Study */}
      <div style={{
        background: "rgba(99, 102, 241, 0.08)",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Sparkles size={16} color="var(--primary-light)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff" }}>
            <span style={{ color: "var(--primary-light)", marginRight: "0.35rem" }}>Action Plan:</span>
            {recommendation.action_plan}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <Clock size={14} />
          Est. Time: <strong style={{ color: "#ffffff" }}>{recommendation.estimated_hours || 6}h</strong>
        </div>
      </div>

      {/* Why this recommendation summary */}
      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "0.75rem" }}>
        <strong style={{ color: "#ffffff" }}>Why this recommendation? </strong>
        {recommendation.why_recommended}
      </div>

      {/* Expand / Collapse Details Button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-subtle)", paddingTop: "0.6rem" }}>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--primary-light)",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: 0
          }}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isExpanded ? "Hide Scoring Breakdown & Resources" : "View Scoring Breakdown & Learning Resources"}
        </button>

        {resources.length > 0 && !isExpanded && (
          <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
            {resources.length} curated resources available
          </span>
        )}
      </div>

      {/* Expanded Factors & Learning Resources */}
      {isExpanded && (
        <div style={{ marginTop: "1rem" }} className="animate-fade-in">
          {/* Factor Breakdown */}
          <RecommendationFactors factors={recommendation.factors} />

          {/* Curated Resources */}
          {resources.length > 0 && (
            <div style={{ marginTop: "1.25rem" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.65rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <BookOpen size={16} color="var(--primary-light)" />
                Recommended Learning Resources for {recommendation.skill_name}
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "0.75rem"
              }}>
                {resources.slice(0, 4).map((res, i) => (
                  <ResourceCard key={i} resource={res} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
