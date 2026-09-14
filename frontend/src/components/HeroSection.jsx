import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, Target, BarChart2, BookOpen, Layers } from "lucide-react";

export default function HeroSection({ onOpenDemo }) {
  const steps = [
    {
      num: "01",
      title: "Upload Resume",
      desc: "Upload PDF/DOCX resume or let PrepWise extract technical competencies automatically.",
      icon: Layers
    },
    {
      num: "02",
      title: "Add Job Description",
      desc: "Paste target job description to segment Required vs Preferred technical requirements.",
      icon: Target
    },
    {
      num: "03",
      title: "Analyze Skill Gaps",
      desc: "Semantic matching evaluates competency alignment (Strong, Partial, Weak, Missing).",
      icon: BarChart2
    },
    {
      num: "04",
      title: "Get Preparation Roadmap",
      desc: "Receive explainable Top 5 priorities with curated resources and a 5-day study plan.",
      icon: BookOpen
    }
  ];

  return (
    <div>
      {/* Hero Header */}
      <section style={{ padding: "4rem 0 3rem 0", textAlign: "center" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.35rem 0.9rem",
          borderRadius: "9999px",
          background: "rgba(99, 102, 241, 0.12)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          color: "var(--primary-light)",
          fontSize: "0.85rem",
          fontWeight: 600,
          marginBottom: "1.5rem"
        }}>
          <Sparkles size={16} />
          Intelligent Placement Preparation MVP
        </div>

        <h1 style={{
          fontSize: "clamp(2.4rem, 5vw, 3.75rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          marginBottom: "1.25rem"
        }}>
          Prepare Smarter. <br />
          <span style={{
            background: "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Get Placement Ready.
          </span>
        </h1>

        <p style={{
          maxWidth: "680px",
          margin: "0 auto 2.25rem auto",
          fontSize: "1.15rem",
          color: "var(--text-muted)",
          lineHeight: 1.6
        }}>
          PrepWise compares your resume directly against your target company's job description.
          It isolates your critical skill gaps and provides an explainable, prioritized 5-day roadmap.
        </p>

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <Link to="/analyze" className="btn btn-primary" style={{ padding: "0.8rem 1.75rem", fontSize: "1rem" }}>
            Start Your Analysis
            <ArrowRight size={18} />
          </Link>

          <button
            onClick={onOpenDemo}
            className="btn btn-demo"
            style={{ padding: "0.8rem 1.75rem", fontSize: "1rem" }}
          >
            <Sparkles size={18} />
            Try Live Demo
          </button>
        </div>
      </section>

      {/* 4-Step Process */}
      <section style={{ padding: "2.5rem 0 4rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            How PrepWise Works
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            From raw documents to an actionable, explainable preparation roadmap in seconds.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem"
        }}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "rgba(255, 255, 255, 0.04)",
                  position: "absolute",
                  top: "0.75rem",
                  right: "1rem"
                }}>
                  {step.num}
                </div>

                <div style={{
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "0.5rem",
                  background: "rgba(99, 102, 241, 0.15)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem"
                }}>
                  <Icon size={22} color="var(--primary-light)" />
                </div>

                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What Makes PrepWise Different */}
      <section style={{
        padding: "3rem",
        borderRadius: "1.25rem",
        background: "linear-gradient(135deg, rgba(30, 41, 67, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)",
        border: "1px solid var(--border-highlight)",
        marginBottom: "4rem"
      }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.85rem", fontWeight: 800, marginBottom: "1rem" }}>
            What Makes PrepWise Different?
          </h2>
          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "2rem" }}>
            Most tools merely highlight keywords missing from your resume. PrepWise is a true <strong>recommendation system</strong> that evaluates your actual competency gaps, considers role importance and prerequisites, and explains exactly <em>why</em> each topic is prioritized.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.25rem",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <CheckCircle2 size={22} color="var(--status-strong)" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <div>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "0.2rem" }}>
                  Multi-Factor Recommendation Formula
                </strong>
                <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Combines JD Relevance (30%), Skill Gap (25%), Role Importance (20%), Prerequisite Readiness (10%), User Preference (10%), and History (5%).
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <CheckCircle2 size={22} color="var(--status-strong)" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <div>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "0.2rem" }}>
                  Prerequisite Graph Intelligence
                </strong>
                <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Prevents recommending advanced concepts (e.g. System Design) until core foundations (DSA/DBMS) are established.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <CheckCircle2 size={22} color="var(--status-strong)" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <div>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "0.2rem" }}>
                  100% Explainable Scoring
                </strong>
                <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  No black-box recommendations. Every priority card features transparent factor breakdowns and tailored rationale.
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <CheckCircle2 size={22} color="var(--status-strong)" style={{ flexShrink: 0, marginTop: "0.15rem" }} />
              <div>
                <strong style={{ display: "block", color: "#ffffff", marginBottom: "0.2rem" }}>
                  Zero External API Dependency
                </strong>
                <span style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  Engineered with a resilient 4-tier local NLP architecture that works locally and reliably.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
