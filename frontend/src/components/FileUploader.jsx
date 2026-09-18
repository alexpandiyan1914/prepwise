import React, { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, X } from "lucide-react";

export default function FileUploader({
  label = "Upload Resume",
  accept = ".pdf,.docx,.txt",
  onFileSelect,
  selectedFile,
  onClear,
  helperText = "Supports PDF, DOCX, or TXT (Max 16MB)"
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        {label}
      </label>

      {selectedFile ? (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.85rem 1rem",
          borderRadius: "0.625rem",
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid var(--status-strong-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
            <FileText size={22} color="var(--status-strong)" />
            <div style={{ overflow: "hidden" }}>
              <div style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {selectedFile.name}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-dim)",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "0.25rem"
            }}
            title="Remove file"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            border: `2px dashed ${isDragging ? "var(--primary)" : "var(--border-subtle)"}`,
            borderRadius: "0.625rem",
            padding: "1.75rem 1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: isDragging ? "var(--primary-glow)" : "rgba(21, 29, 47, 0.4)",
            transition: "all 0.15s ease"
          }}
        >
          <UploadCloud
            size={32}
            color={isDragging ? "var(--primary-light)" : "var(--text-dim)"}
            style={{ margin: "0 auto 0.65rem auto", display: "block" }}
          />
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "0.2rem" }}>
            Click or drag & drop document here
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {helperText}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
}
