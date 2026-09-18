import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Response interceptor for clear errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Network error. Please check if the PrepWise backend server is running.";
    if (error.response && error.response.data && error.response.data.error) {
      message = error.response.data.error;
    } else if (error.message) {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

export const getHealth = async () => {
  const res = await api.get("/health");
  return res.data;
};

export const saveProfile = async (profileData) => {
  const res = await api.post("/profile", profileData);
  return res.data;
};

export const getProfile = async () => {
  const res = await api.get("/profile");
  return res.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const uploadJd = async (file, company = "", role = "") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("company_name", company);
  formData.append("target_role", role);
  const res = await api.post("/upload/jd", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const submitJdText = async (text, company = "", role = "") => {
  const res = await api.post("/jd/text", {
    text,
    company_name: company,
    target_role: role,
  });
  return res.data;
};

export const runAnalyze = async (payload) => {
  // If payload is FormData (file uploads) vs JSON
  if (payload instanceof FormData) {
    const res = await api.post("/analyze", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }
  const res = await api.post("/analyze", payload);
  return res.data;
};

export const getAnalysis = async (id) => {
  const res = await api.get(`/analysis/${id}`);
  return res.data;
};

export const getAnalysisSkills = async (id) => {
  const res = await api.get(`/analysis/${id}/skills`);
  return res.data;
};

export const getAnalysisRoadmap = async (id) => {
  const res = await api.get(`/analysis/${id}/roadmap`);
  return res.data;
};

export const getRecommendations = async (analysisId) => {
  const res = await api.get(`/analysis/${analysisId}/recommendations`);
  return res.data;
};

export const getResources = async (canonicalId, preferred = []) => {
  const prefStr = preferred.join(",");
  const res = await api.get(`/resources/${canonicalId}?preferred=${prefStr}`);
  return res.data;
};

export const getDemoCases = async () => {
  const res = await api.get("/demo/cases");
  return res.data;
};

export const getDemoCaseDetail = async (caseId) => {
  const res = await api.get(`/demo/cases/${caseId}`);
  return res.data;
};

export default api;
