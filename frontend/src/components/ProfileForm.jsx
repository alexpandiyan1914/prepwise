import React from "react";
import { User, Clock, CheckSquare, Sparkles } from "lucide-react";

export default function ProfileForm({
  studentName,
  setStudentName,
  experienceLevel,
  setExperienceLevel,
  dailyHours,
  setDailyHours,
  preferredLearning,
  toggleLearningPreference,
  assessmentScore,
  setAssessmentScore
}) {
  const learningOptions = ["Video", "Practice", "Articles", "Courses", "Documentation"];

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        <span style={{
          width: "1.5rem",
          height: "1.5rem",
          borderRadius: "50%",
          background: "var(--primary-glow)",
          color: "var(--primary-light)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
          fontWeight: 800
        }}>1</span>
        Student Profile & Learning Preferences
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
            Candidate Name *
          </label>
          <input
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="e.g. Alex Pandian"
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: "0.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "#ffffff",
              fontSize: "0.9rem"
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
            Current Experience Level
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: "0.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "#ffffff",
              fontSize: "0.9rem"
            }}
          >
            <option value="Beginner">Beginner (College Student / Fresher)</option>
            <option value="Intermediate">Intermediate (1-2 internships / personal projects)</option>
            <option value="Advanced">Advanced (Extensive coding & project experience)</option>
          </select>
        </div>
      </div>

      {/* Daily Prep Hours and Optional Assessment Score */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Clock size={15} color="var(--primary-light)" />
              Daily Prep Time:
            </label>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-light)" }}>
              {dailyHours} hours/day
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={dailyHours}
            onChange={(e) => setDailyHours(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--primary)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-dim)" }}>
            <span>1 hr</span>
            <span>4 hrs</span>
            <span>8 hrs</span>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
            Optional Assessment Score (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={assessmentScore || ""}
            onChange={(e) => setAssessmentScore(e.target.value ? parseFloat(e.target.value) : "")}
            placeholder="e.g. 75 (Leave empty if none taken)"
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: "0.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "#ffffff",
              fontSize: "0.9rem"
            }}
          />
        </div>
      </div>

      {/* Preferred Learning Modalities */}
      <div>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          Preferred Learning Formats (Influences resource selection)
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {learningOptions.map((opt) => {
            const isSelected = preferredLearning.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleLearningPreference(opt)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  borderRadius: "9999px",
                  border: `1px solid ${isSelected ? "var(--primary)" : "var(--border-subtle)"}`,
                  background: isSelected ? "var(--primary-glow)" : "var(--bg-surface)",
                  color: isSelected ? "#ffffff" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <CheckSquare size={14} color={isSelected ? "var(--primary-light)" : "var(--text-dim)"} />
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
