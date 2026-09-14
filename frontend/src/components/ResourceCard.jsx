import React from "react";
import { ExternalLink, Video, FileText, BookOpen, Code2, Clock } from "lucide-react";

export default function ResourceCard({ resource }) {
  const getIcon = (type) => {
    const t = (type || "").toLowerCase();
    if (t.includes("video")) return <Video size={16} color="#f43f5e" />;
    if (t.includes("practice")) return <Code2 size={16} color="#10b981" />;
    if (t.includes("course")) return <BookOpen size={16} color="#8b5cf6" />;
    return <FileText size={16} color="#38bdf8" />;
  };

  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "0.5rem",
      padding: "0.85rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "all 0.15s ease"
    }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "var(--text-muted)"
          }}>
            {getIcon(resource.resource_type)}
            {resource.resource_type}
          </span>

          <span style={{
            fontSize: "0.72rem",
            color: "var(--text-dim)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem"
          }}>
            <Clock size={12} />
            {resource.estimated_hours || 4}h
          </span>
        </div>

        <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#ffffff", marginBottom: "0.25rem", lineHeight: 1.35 }}>
          {resource.title}
        </h5>

        <div style={{ fontSize: "0.75rem", color: "var(--primary-light)", fontWeight: 600, marginBottom: "0.4rem" }}>
          {resource.provider}
        </div>

        {resource.description && (
          <p style={{ fontSize: "0.76rem", color: "var(--text-dim)", lineHeight: 1.4, marginBottom: "0.75rem" }}>
            {resource.description}
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 600,
          padding: "0.15rem 0.45rem",
          borderRadius: "0.25rem",
          background: "rgba(255,255,255,0.05)",
          color: "var(--text-muted)"
        }}>
          {resource.difficulty || "Intermediate"}
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.76rem",
            fontWeight: 600,
            color: "var(--primary-light)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            textDecoration: "none"
          }}
        >
          Open Resource
          <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
}
