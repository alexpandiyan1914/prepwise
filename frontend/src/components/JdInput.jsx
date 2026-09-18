import React, { useState } from "react";
import { FileText, Type, Sparkles } from "lucide-react";
import FileUploader from "./FileUploader";

export default function JdInput({
  companyName,
  setCompanyName,
  targetRole,
  setTargetRole,
  jdText,
  setJdText,
  jdFile,
  setJdFile,
  onPreFillSample
}) {
  const [inputMode, setInputMode] = useState("paste"); // "paste" or "upload"

  return (
    <div className="card" style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
          }}>2</span>
          Target Job Description (JD)
        </h3>

        {/* Toggle Mode */}
        <div style={{
          display: "flex",
          background: "var(--bg-surface)",
          padding: "0.2rem",
          borderRadius: "0.375rem",
          border: "1px solid var(--border-subtle)"
        }}>
          <button
            type="button"
            onClick={() => setInputMode("paste")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer",
              background: inputMode === "paste" ? "var(--primary)" : "transparent",
              color: inputMode === "paste" ? "#ffffff" : "var(--text-muted)"
            }}
          >
            <Type size={14} />
            Direct Paste
          </button>
          <button
            type="button"
            onClick={() => setInputMode("upload")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.35rem 0.75rem",
              fontSize: "0.78rem",
              fontWeight: 600,
              borderRadius: "0.25rem",
              border: "none",
              cursor: "pointer",
              background: inputMode === "upload" ? "var(--primary)" : "transparent",
              color: inputMode === "upload" ? "#ffffff" : "var(--text-muted)"
            }}
          >
            <FileText size={14} />
            Upload File
          </button>
        </div>
      </div>

      {/* Company and Role Row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <div>
          <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
            Target Company Name *
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Amazon, Razorpay, Google, Deloitte"
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
            Target Role *
          </label>
          <input
            type="text"
            required
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Software Development Engineer"
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

      {/* Input Mode Content */}
      {inputMode === "paste" ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Paste Job Description Text *
            </label>
            {onPreFillSample && (
              <button
                type="button"
                onClick={onPreFillSample}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent-cyan)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem"
                }}
              >
                <Sparkles size={13} />
                Fill Sample SDE JD
              </button>
            )}
          </div>
          <textarea
            rows={7}
            required
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste complete job description requirements, responsibilities, and qualifications here..."
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
              color: "#ffffff",
              fontSize: "0.88rem",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.4,
              resize: "vertical"
            }}
          />
        </div>
      ) : (
        <div>
          <FileUploader
            label="Upload Job Description File"
            accept=".pdf,.docx,.txt"
            selectedFile={jdFile}
            onFileSelect={setJdFile}
            onClear={() => setJdFile(null)}
            helperText="Upload PDF, DOCX or TXT file of the company job posting"
          />
        </div>
      )}
    </div>
  );
}
