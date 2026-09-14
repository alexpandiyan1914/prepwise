import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfileForm";
import FileUploader from "../components/FileUploader";
import JdInput from "../components/JdInput";
import ErrorMessage from "../components/ErrorMessage";
import { runAnalyze } from "../services/api";
import { Sparkles, ArrowRight, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { DEMO_PRESETS } from "../data/sampleData";

export default function ProfilePage({ onAnalysisSuccess, isProcessing, setIsProcessing }) {
  const navigate = useNavigate();

  // Form State
  const [studentName, setStudentName] = useState("");
  const [targetRole, setTargetRole] = useState("Software Development Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [dailyHours, setDailyHours] = useState(3.0);
  const [preferredLearning, setPreferredLearning] = useState(["Practice", "Video"]);
  const [assessmentScore, setAssessmentScore] = useState("");

  // Resume State
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeInputMode, setResumeInputMode] = useState("file"); // "file" or "paste"

  // JD State
  const [companyName, setCompanyName] = useState("");
  const [jdText, setJdText] = useState("");
  const [jdFile, setJdFile] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const toggleLearningPreference = (opt) => {
    if (preferredLearning.includes(opt)) {
      setPreferredLearning(preferredLearning.filter((item) => item !== opt));
    } else {
      setPreferredLearning([...preferredLearning, opt]);
    }
  };

  const handlePreFillSample = (presetId = "sde") => {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId) || DEMO_PRESETS[0];
    setStudentName(preset.student.name);
    setTargetRole(preset.role);
    setCompanyName(preset.company);
    setExperienceLevel(preset.student.experience_level);
    setDailyHours(preset.student.daily_prep_hours);
    setPreferredLearning(preset.student.preferred_learning);
    setAssessmentScore(preset.student.assessment_score || "");
    setResumeText(preset.resume_text);
    setJdText(preset.jd_text);
    setResumeInputMode("paste");
    setResumeFile(null);
    setJdFile(null);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validations
    if (!studentName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!targetRole.trim()) {
      setErrorMessage("Please specify your target role.");
      return;
    }
    if (!companyName.trim()) {
      setErrorMessage("Please specify the target company name.");
      return;
    }
    if (resumeInputMode === "file" && !resumeFile && !resumeText.trim()) {
      setErrorMessage("Please upload your resume document (PDF, DOCX, or TXT) or paste resume text.");
      return;
    }
    if (resumeInputMode === "paste" && !resumeText.trim()) {
      setErrorMessage("Please paste your resume text.");
      return;
    }
    if (!jdFile && !jdText.trim()) {
      setErrorMessage("Please provide the job description (either paste text or upload a file).");
      return;
    }

    try {
      setIsProcessing(true);

      // Build payload: FormData if files, or JSON if direct text
      let payload;
      if (resumeFile || jdFile) {
        const formData = new FormData();
        formData.append("name", studentName);
        formData.append("target_role", targetRole);
        formData.append("company_name", companyName);
        formData.append("experience_level", experienceLevel);
        formData.append("daily_prep_hours", dailyHours);
        formData.append("preferred_learning", preferredLearning.join(","));
        if (assessmentScore) formData.append("assessment_score", assessmentScore);

        if (resumeFile) {
          formData.append("resume_file", resumeFile);
        } else {
          formData.append("resume_text", resumeText);
        }

        if (jdFile) {
          formData.append("jd_file", jdFile);
        } else {
          formData.append("jd_text", jdText);
        }

        payload = formData;
      } else {
        payload = {
          student: {
            name: studentName,
            target_role: targetRole,
            experience_level: experienceLevel,
            daily_prep_hours: dailyHours,
            preferred_learning: preferredLearning,
            assessment_score: assessmentScore ? parseFloat(assessmentScore) : null
          },
          job: {
            company_name: companyName,
            role_title: targetRole,
            raw_text: jdText
          },
          resume_text: resumeText
        };
      }

      const result = await runAnalyze(payload);
      onAnalysisSuccess(result);
      navigate("/dashboard");
    } catch (err) {
      setErrorMessage(err.message || "Failed to complete placement analysis. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "860px", padding: "2.5rem 1.5rem 5rem 1.5rem" }}>
      {/* Top Banner */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>
            Placement Preparation Setup
          </h2>
          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
            Enter your details, upload your resume, and provide the company JD to generate your roadmap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handlePreFillSample("sde")}
          className="btn btn-secondary"
          style={{ fontSize: "0.82rem" }}
        >
          <Sparkles size={14} color="var(--primary-light)" />
          Quick Prefill: SDE Sample
        </button>
      </div>

      <ErrorMessage message={errorMessage} />

      <form onSubmit={handleSubmit}>
        {/* Step 1: Profile Form */}
        <ProfileForm
          studentName={studentName}
          setStudentName={setStudentName}
          experienceLevel={experienceLevel}
          setExperienceLevel={setExperienceLevel}
          dailyHours={dailyHours}
          setDailyHours={setDailyHours}
          preferredLearning={preferredLearning}
          toggleLearningPreference={toggleLearningPreference}
          assessmentScore={assessmentScore}
          setAssessmentScore={setAssessmentScore}
        />

        {/* Step 2: Resume Input */}
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
              Student Resume
            </h3>

            <div style={{
              display: "flex",
              background: "var(--bg-surface)",
              padding: "0.2rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--border-subtle)"
            }}>
              <button
                type="button"
                onClick={() => setResumeInputMode("file")}
                style={{
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                  background: resumeInputMode === "file" ? "var(--primary)" : "transparent",
                  color: resumeInputMode === "file" ? "#ffffff" : "var(--text-muted)"
                }}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setResumeInputMode("paste")}
                style={{
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  borderRadius: "0.25rem",
                  border: "none",
                  cursor: "pointer",
                  background: resumeInputMode === "paste" ? "var(--primary)" : "transparent",
                  color: resumeInputMode === "paste" ? "#ffffff" : "var(--text-muted)"
                }}
              >
                Paste Text
              </button>
            </div>
          </div>

          {resumeInputMode === "file" ? (
            <FileUploader
              label="Upload Resume Document"
              accept=".pdf,.docx,.txt"
              selectedFile={resumeFile}
              onFileSelect={(file) => {
                setResumeFile(file);
                setResumeText("");
              }}
              onClear={() => setResumeFile(null)}
              helperText="Upload your PDF or DOCX placement resume"
            />
          ) : (
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                Paste Resume Text Content
              </label>
              <textarea
                rows={6}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your technical skills, projects, and coursework text here..."
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
          )}
        </div>

        {/* Step 3: Job Description Input */}
        <JdInput
          companyName={companyName}
          setCompanyName={setCompanyName}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          jdText={jdText}
          setJdText={setJdText}
          jdFile={jdFile}
          setJdFile={setJdFile}
          onPreFillSample={() => setJdText(DEMO_PRESETS[0].jd_text)}
        />

        {/* Action Button */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            type="submit"
            disabled={isProcessing}
            className="btn btn-primary pulse-glow"
            style={{
              padding: "0.9rem 2.5rem",
              fontSize: "1.1rem",
              width: "100%",
              maxWidth: "380px"
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="spin" style={{ animation: "spin 1s linear infinite" }} />
                Analyzing Your Profile...
              </>
            ) : (
              <>
                Analyze My Placement Readiness
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
