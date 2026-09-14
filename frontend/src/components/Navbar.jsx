import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Compass, Sparkles, BookOpen, Layers, Map, Activity } from "lucide-react";
import { getHealth } from "../services/api";

export default function Navbar({ onOpenDemoModal }) {
  const location = useLocation();
  const [backendOnline, setBackendOnline] = useState(null);

  useEffect(() => {
    getHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const navLinks = [
    { path: "/", label: "Home", icon: Compass },
    { path: "/analyze", label: "Analyze", icon: Sparkles },
    { path: "/dashboard", label: "Dashboard", icon: Layers },
    { path: "/roadmap", label: "5-Day Roadmap", icon: Map },
  ];

  return (
    <header style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      backdropFilter: "blur(12px)",
      backgroundColor: "rgba(11, 15, 25, 0.85)",
      borderBottom: "1px solid var(--border-subtle)"
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "4.25rem"
      }}>
        {/* Brand */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.625rem",
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(99, 102, 241, 0.4)"
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              background: "linear-gradient(to right, #ffffff, #c7d2fe)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              PrepWise
            </div>
            <div style={{ fontSize: "0.68rem", color: "var(--text-dim)", fontWeight: 500 }}>
              Placement Readiness AI
            </div>
          </div>
        </Link>

        {/* Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem 0.85rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  borderRadius: "0.375rem",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                  background: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                  border: isActive ? "1px solid rgba(99, 102, 241, 0.3)" : "1px solid transparent",
                  transition: "all 0.15s ease"
                }}
              >
                <Icon size={16} color={isActive ? "var(--primary-light)" : "currentColor"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Status */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div
            title={backendOnline ? "Backend API connected" : "Connecting to backend..."}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.75rem",
              color: backendOnline ? "var(--status-strong)" : "var(--status-partial)",
              padding: "0.2rem 0.6rem",
              borderRadius: "9999px",
              background: backendOnline ? "var(--status-strong-bg)" : "var(--status-partial-bg)",
              border: `1px solid ${backendOnline ? "var(--status-strong-border)" : "var(--status-partial-border)"}`
            }}
          >
            <span style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: backendOnline ? "var(--status-strong)" : "var(--status-partial)",
              boxShadow: backendOnline ? "0 0 8px var(--status-strong)" : "none"
            }} />
            {backendOnline ? "API Live" : "API Checking"}
          </div>

          <button
            onClick={onOpenDemoModal}
            className="btn btn-demo"
            style={{ padding: "0.45rem 1rem", fontSize: "0.85rem" }}
          >
            <Sparkles size={15} />
            Try Demo
          </button>
        </div>
      </div>
    </header>
  );
}
