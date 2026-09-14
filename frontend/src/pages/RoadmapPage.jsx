import React from "react";
import { Link, useNavigate } from "react-router-dom";
import RoadmapTimeline from "../components/RoadmapTimeline";
import { ArrowLeft, Printer, Share2, Layers } from "lucide-react";

export default function RoadmapPage({ analysisData }) {
  const navigate = useNavigate();

  if (!analysisData) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem" }}>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            No Active Roadmap Found
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
            Please run an analysis first to generate your custom 5-day placement preparation roadmap.
          </p>
          <Link to="/analyze" className="btn btn-primary">
            Start New Analysis
          </Link>
        </div>
      </div>
    );
  }

  const { student, job, roadmap } = analysisData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ maxWidth: "900px", padding: "2.5rem 1.5rem 5rem 1.5rem" }}>
      {/* Top Controls Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn btn-secondary"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            <Printer size={15} />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Target Role & Candidate Summary Card */}
      <div className="card" style={{
        marginBottom: "2rem",
        background: "linear-gradient(135deg, rgba(30, 41, 67, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)",
        border: "1px solid var(--border-highlight)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <span style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontWeight: 700, textTransform: "uppercase" }}>
              Tailored Placement Sprint
            </span>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 800, marginTop: "0.15rem", marginBottom: "0.35rem" }}>
              {job.role} Preparation Sprint
            </h2>
            <div style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Prepared for <strong>{student.name}</strong> targeting <strong>{job.company}</strong> ({student.experience_level} level)
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: 700, textTransform: "uppercase" }}>
              Pace Schedule
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-light)" }}>
              {student.daily_prep_hours} Hours / Day
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Interactive Timeline Component */}
      <RoadmapTimeline
        roadmap={roadmap || []}
        dailyHours={student.daily_prep_hours || 3.0}
      />
    </div>
  );
}
