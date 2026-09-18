import re
from typing import List, Dict, Any
from backend.services.skill_normalizer import SkillNormalizer

class SkillExtractor:
    def __init__(self, normalizer: SkillNormalizer = None):
        self.normalizer = normalizer or SkillNormalizer()

    def extract_skills_from_text(self, text: str, source_type: str = "resume") -> List[Dict[str, Any]]:
        if not text:
            return []
            
        extracted_map = {}
        text_lower = " " + text.lower() + " "
        
        for canonical_id, meta in self.normalizer.taxonomy.items():
            name = meta["name"]
            aliases = meta.get("aliases", []) + [name.lower()]
            
            matched_alias = None
            evidence_snippet = None
            
            for alias in sorted(aliases, key=lambda x: len(x), reverse=True):
                # Special handling for single-character 'c'
                if alias == "c":
                    pattern = r"(?<![a-zA-Z0-9])c\s+(?:language|programming|code)|(?<![a-zA-Z0-9])c\s*[/,]\s*(?:c\+\+|cpp)"
                elif alias == "c++":
                    pattern = r"(?<![a-zA-Z0-9])c\+\+|(?<![a-zA-Z0-9])cpp(?![a-zA-Z0-9])|(?<![a-zA-Z0-9])c\s+plus\s+plus(?![a-zA-Z0-9])"
                elif alias in ("dsa", "oop", "dbms", "os", "cn", "sql", "aws", "gcp", "git"):
                    pattern = rf"(?<![a-zA-Z0-9]){re.escape(alias)}(?![a-zA-Z0-9])"
                else:
                    escaped = re.escape(alias)
                    pattern = rf"(?<![a-zA-Z0-9]){escaped}(?![a-zA-Z0-9])"

                match = re.search(pattern, text_lower)
                if match:
                    matched_alias = alias
                    start = max(0, match.start() - 40)
                    end = min(len(text), match.end() + 60)
                    evidence_snippet = text[start:end].replace("\n", " ").strip()
                    break
                    
            if matched_alias:
                level = self._estimate_proficiency(text_lower, matched_alias, meta.get("keywords", []))
                
                extracted_map[canonical_id] = {
                    "skill_name": meta["name"],
                    "canonical_id": canonical_id,
                    "category": meta["category"],
                    "proficiency_level": level,
                    "evidence_text": evidence_snippet or f"Mentioned {matched_alias} in {source_type}",
                    "source": source_type
                }
                
        return list(extracted_map.values())

    def _estimate_proficiency(self, text_lower: str, alias: str, keywords: List[str]) -> int:
        score = 2
        keyword_hits = 0
        for kw in keywords:
            if kw.lower() in text_lower:
                keyword_hits += 1
                
        if keyword_hits >= 4:
            score += 2
        elif keyword_hits >= 2:
            score += 1
            
        strong_indicators = ["proficient", "advanced", "expert", "deep understanding", "lead", "architect", "production", "years of experience"]
        basic_indicators = ["basic", "familiar with", "beginner", "learning", "introductory", "coursework"]
        
        window = 100
        pos = text_lower.find(alias)
        if pos != -1:
            local_context = text_lower[max(0, pos - window): min(len(text_lower), pos + window)]
            if any(ind in local_context for ind in strong_indicators):
                score = max(score, 4)
            elif any(ind in local_context for ind in basic_indicators):
                score = min(score, 2)
                
        return min(5, max(1, score))
