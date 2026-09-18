import re
from pathlib import Path
from backend.services.resume_parser import ResumeParser

class JobDescriptionParser:
    @staticmethod
    def extract_text(file_path: str) -> str:
        return ResumeParser.extract_text(file_path)

    @staticmethod
    def parse(file_path: str = None, raw_text: str = None, company: str = None, role: str = None) -> dict:
        text = raw_text or ""
        if file_path:
            text = JobDescriptionParser.extract_text(file_path)
            
        if not text.strip():
            raise ValueError("Job description text cannot be empty.")
            
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        
        inferred_company = company or "Target Company"
        inferred_role = role or "Software Engineer"
        
        if not role:
            for line in lines[:5]:
                for r in ["Software Development Engineer", "Software Engineer", "Frontend Developer", "Backend Developer", "Data Analyst", "Full Stack Engineer"]:
                    if r.lower() in line.lower():
                        inferred_role = r
                        break
                        
        sections = JobDescriptionParser._segment_jd(text)
        
        return {
            "company": inferred_company,
            "role": inferred_role,
            "full_text": text,
            "required_text": sections.get("required", ""),
            "preferred_text": sections.get("preferred", ""),
            "responsibilities_text": sections.get("responsibilities", "")
        }

    @staticmethod
    def _segment_jd(text: str) -> dict:
        headers = {
            "required": r"(required\s+skills|requirements|basic\s+qualifications|what\s+you\s+need|must\s+have|qualifications)",
            "preferred": r"(preferred\s+skills|preferred\s+qualifications|good\s+to\s+have|nice\s+to\s+have|bonus\s+points)",
            "responsibilities": r"(responsibilities|what\s+you\s+will\s+do|role\s+overview|job\s+description|about\s+the\s+role)"
        }
        
        sections = {"required": "", "preferred": "", "responsibilities": "", "general": ""}
        current_section = "general"
        
        for line in text.split("\n"):
            stripped = line.strip()
            matched = None
            for key, pat in headers.items():
                if re.search(rf"^{pat}[:\s]*$", stripped, re.IGNORECASE) or re.search(rf"###?\s*{pat}", stripped, re.IGNORECASE):
                    matched = key
                    break
            if matched:
                current_section = matched
            else:
                sections[current_section] += line + "\n"
                
        if not sections["required"].strip():
            sections["required"] = sections["general"]
            
        return sections
