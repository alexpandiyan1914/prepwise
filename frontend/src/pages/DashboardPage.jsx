import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReadinessScore from "../components/ReadinessScore";
import RecommendationCard from "../components/RecommendationCard";
import SkillOverview from "../components/SkillOverview";
import { ArrowRight, Map, RotateCcw, Award, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

export default function DashboardPage({ analysisData, onReset }) {
  const navigate = useNavigate();

  useEffect(() => {
    // If user has high readiness score, trigger celebratory confetti
    if (analysisData && analysisData.readiness_score >= 70) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  }, [analysisData]);

  if (!analysisData) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "6rem 1rem" }}>
        <div className="card" style={{ maxWidth: "500px", margin: "0 auto", padding: "3rem" }}>
          <h3 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            No Analysis Results Found
          </h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
            Please submit your profile, resume, and target company JD first, or run a quick demo case.
          </p>
          <Link to="/analyze" className="btn btn-primary">
            Start New Analysis
          </Link>
        </div>
      </div>
    );
  }

  const { student, job, readiness_score, metrics, all_gaps, top_recommendations, nlp_method_used } = analysisData;

  return (
    <div className="container" style={{ padding: "2.5rem 1.5rem 5rem 1.5rem" }}>
      {/* Top Controls Bar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "1.75rem"
      }}>
        <div>
          <span style={{ fontSize: "0.78rem", color: "var(--primary-light)", fontWeight: 700, textTransform: "uppercase" }}>
            Candidate Analysis • {student.name}
          </span>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>
            Placement Readiness Dashboard
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            onClick={() => {
              if (onReset) onReset();
              navigate("/analyze");
            }}
            className="btn btn-secondary"
            style={{ fontSize: "0.85rem" }}
          >
            <RotateCcw size={15} />
            New Analysis
          </button>

          <Link
            to="/roadmap"
            className="btn btn-primary"
            style={{ fontSize: "0.85rem" }}
          >
            <Map size={16} />
            View 5-Day Roadmap
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* 1. Readiness Score Component */}
      <ReadinessScore
        score={Math.round(readiness_score)}
        companyName={job.company}
        targetRole={job.role}
        metrics={metrics}
        nlpMethod={nlp_method_used}
      />

      {/* 2. Top 5 Preparation Priorities Section (CORE VALUE) */}
      <section style={{ marginBottom: "3.5rem" }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.25rem"
        }}>
          <div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--priority-very-high)",
              marginBottom: "0.25rem"
            }}>
              <Award size={14} />
              Core Recommendation Engine Output
            </div>
            <h3 style={{ fontSize: "1.45rem", fontWeight: 800 }}>
              Your Top Preparation Priorities
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
              Ranked dynamically by the weighted multi-factor formula with prerequisite validation.
            </p>
          </div>

          <Link to="/roadmap" className="btn btn-secondary" style={{ fontSize: "0.82rem" }}>
            See Daily Schedule
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* List of Recommendation Cards */}
        {top_recommendations && top_recommendations.length > 0 ? (
          <div>
            {top_recommendations.map((rec) => (
              <RecommendationCard key={rec.canonical_id || rec.rank} recommendation={rec} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: "center", padding: "2rem", color: "var(--text-dim)" }}>
            No recommendations generated.
          </div>
        )}
      </section>

      {/* 3. Dedicated Skill Gap Matrix Section */}
      <section>
        <SkillOverview gaps={all_gaps || []} />
      </section>

      {/* Bottom CTA to Roadmap */}
      <div style={{
        marginTop: "3rem",
        textAlign: "center",
        padding: "2.5rem",
        background: "linear-gradient(135deg, rgba(30, 41, 67, 0.5) 0%, rgba(15, 23, 42, 0.8) 100%)",
        border: "1px solid var(--border-highlight)",
        borderRadius: "1rem"
      }}>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
          Ready to Start Preparing?
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", maxWidth: "550px", margin: "0 auto 1.5rem auto" }}>
          Follow your personalized 5-day placement preparation sprint sequenced specifically for {job.role} at {job.company}.
        </p>
        <Link to="/roadmap" className="btn btn-primary" style={{ padding: "0.75rem 2rem", fontSize: "0.95rem" }}>
          Open 5-Day Preparation Roadmap
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
