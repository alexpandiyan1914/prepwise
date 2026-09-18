import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;

  return (
    <div style={{
      padding: "1rem 1.25rem",
      borderRadius: "0.625rem",
      background: "var(--status-missing-bg)",
      border: "1px solid var(--status-missing-border)",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1.5rem"
    }} className="animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <AlertCircle size={20} color="var(--status-missing)" style={{ flexShrink: 0 }} />
        <span style={{ fontSize: "0.9rem" }}>{message}</span>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-secondary"
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
        >
          <RefreshCw size={13} />
          Retry
        </button>
      )}
    </div>
  );
}
