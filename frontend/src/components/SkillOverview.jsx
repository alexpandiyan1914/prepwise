import React, { useState } from "react";
import SkillGapCard from "./SkillGapCard";
import { Filter, Layers } from "lucide-react";

export default function SkillOverview({ gaps = [] }) {
  const [activeTab, setActiveTab] = useState("ALL");

  const tabs = [
    { id: "ALL", label: "All Skills", count: gaps.length },
    { id: "STRONG_MATCH", label: "Strong Match", count: gaps.filter(g => g.status === "STRONG_MATCH").length },
    { id: "PARTIAL_MATCH", label: "Partial Match", count: gaps.filter(g => g.status === "PARTIAL_MATCH").length },
    { id: "WEAK", label: "Weak Evidence", count: gaps.filter(g => g.status === "WEAK").length },
    { id: "MISSING", label: "Missing", count: gaps.filter(g => g.status === "MISSING").length },
  ];

  const filteredGaps = activeTab === "ALL"
    ? gaps
    : gaps.filter(g => g.status === activeTab);

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1.25rem"
      }}>
        <div>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Layers size={22} color="var(--primary-light)" />
            Skill Gap & Competency Matrix
          </h3>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Breakdown of student resume evidence against target JD requirements.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: "flex",
          gap: "0.4rem",
          background: "var(--bg-surface)",
          padding: "0.25rem",
          borderRadius: "0.5rem",
          border: "1px solid var(--border-subtle)",
          flexWrap: "wrap"
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.75rem",
                borderRadius: "0.375rem",
                border: "none",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                background: activeTab === tab.id ? "var(--primary)" : "transparent",
                color: activeTab === tab.id ? "#ffffff" : "var(--text-muted)",
                transition: "all 0.15s ease"
              }}
            >
              {tab.label}
              <span style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.35rem",
                borderRadius: "9999px",
                background: activeTab === tab.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)",
                color: "#ffffff"
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredGaps.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-dim)" }}>
          No skills found under this category.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.25rem"
        }}>
          {filteredGaps.map((gap, index) => (
            <SkillGapCard key={gap.canonical_id || index} gap={gap} />
          ))}
        </div>
      )}
    </div>
  );
}
