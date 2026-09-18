import React, { useState } from "react";
import { Calendar, CheckCircle2, Clock, Sparkles, BookOpen, ChevronRight } from "lucide-react";

export default function RoadmapTimeline({ roadmap = [], dailyHours = 3.0 }) {
  const [completedDays, setCompletedDays] = useState({});

  const toggleDayComplete = (dayNum) => {
    setCompletedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "VERY HIGH": return "priority-pill priority-very-high";
      case "HIGH": return "priority-pill priority-high";
      case "MEDIUM": return "priority-pill priority-medium";
      default: return "priority-pill priority-low";
    }
  };

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / (roadmap.length || 5)) * 100);

  return (
    <div style={{ marginBottom: "3rem" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1.5rem"
      }}>
        <div>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--accent-cyan)",
            marginBottom: "0.3rem"
          }}>
            <Calendar size={14} />
            Personalized Placement Sprint
          </div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            Your 5-Day Preparation Roadmap
          </h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            Dynamically sequenced by recommendation priority, prerequisites, and your {dailyHours}h/day availability.
          </p>
        </div>

        {/* Sprint Progress */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          padding: "0.75rem 1.25rem",
          borderRadius: "0.625rem",
          minWidth: "200px"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", marginBottom: "0.35rem" }}>
            <span style={{ color: "var(--text-muted)" }}>Sprint Progress:</span>
            <span style={{ fontWeight: 700, color: "#ffffff" }}>{completedCount}/5 Days ({progressPercent}%)</span>
          </div>
          <div style={{
            height: "6px",
            width: "100%",
            borderRadius: "9999px",
            background: "rgba(255, 255, 255, 0.08)",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #6366f1, #10b981)",
              borderRadius: "9999px",
              transition: "width 0.4s ease"
            }} />
          </div>
        </div>
      </div>

      {/* Days Timeline */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {roadmap.map((day) => {
          const isDone = !!completedDays[day.day_number];

          return (
            <div
              key={day.day_number}
              className="card"
              style={{
                background: isDone ? "rgba(16, 185, 129, 0.05)" : "var(--bg-card)",
                border: isDone ? "1px solid var(--status-strong-border)" : "1px solid var(--border-subtle)",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "0.85rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <button
                    type="button"
                    onClick={() => toggleDayComplete(day.day_number)}
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "0.5rem",
                      background: isDone ? "var(--status-strong)" : "rgba(99, 102, 241, 0.15)",
                      color: isDone ? "#ffffff" : "var(--primary-light)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: "0.95rem"
                    }}
                    title={isDone ? "Mark day incomplete" : "Mark day complete"}
                  >
                    {isDone ? <CheckCircle2 size={20} /> : `D${day.day_number}`}
                  </button>

                  <div>
                    <h4 style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: isDone ? "var(--text-muted)" : "#ffffff",
                      textDecoration: isDone ? "line-through" : "none"
                    }}>
                      {day.title}
                    </h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "0.15rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <Clock size={13} />
                        {day.estimated_hours || dailyHours} hours planned
                      </span>
                      <span>•</span>
                      <span>Day {day.day_number} of 5</span>
                    </div>
                  </div>
                </div>

                <span className={getPriorityBadge(day.priority)}>
                  {day.priority}
                </span>
              </div>

              {/* Subtopics Pills */}
              {day.focus_topics && day.focus_topics.length > 0 && (
                <div style={{ marginBottom: "0.85rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.35rem" }}>
                    Key Focus Topics:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {day.focus_topics.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          padding: "0.2rem 0.6rem",
                          borderRadius: "0.375rem",
                          background: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          color: "var(--text-muted)"
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Checklist */}
              {day.action_items && day.action_items.length > 0 && (
                <div style={{
                  background: "rgba(11, 15, 25, 0.4)",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  borderLeft: "3px solid var(--primary)"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                    Daily Action Items:
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {day.action_items.map((act, idx) => (
                      <li key={idx} style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "flex-start", gap: "0.4rem", marginBottom: "0.2rem" }}>
                        <ChevronRight size={14} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: "0.2rem" }} />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
