import json
import re
from pathlib import Path

class SkillNormalizer:
    def __init__(self, taxonomy_file: str = None):
        if not taxonomy_file:
            taxonomy_file = str(Path(__file__).parent.parent / "data" / "skills.json")
            
        self.taxonomy = {}
        self.alias_map = {}
        self._load_taxonomy(taxonomy_file)

    def _load_taxonomy(self, filepath: str):
        path = Path(filepath)
        if not path.exists():
            return
            
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        for item in data:
            c_id = item["id"]
            self.taxonomy[c_id] = item
            self.alias_map[item["name"].lower()] = c_id
            self.alias_map[c_id.lower()] = c_id
            for alias in item.get("aliases", []):
                self.alias_map[alias.lower().strip()] = c_id

    def normalize(self, raw_skill: str) -> dict:
        if not raw_skill:
            return None
            
        cleaned = re.sub(r"[^a-zA-Z0-9+#/.]", " ", raw_skill).strip().lower()
        cleaned = re.sub(r"\s+", " ", cleaned)
        
        # 1. Exact alias match
        if cleaned in self.alias_map:
            c_id = self.alias_map[cleaned]
            return self.taxonomy[c_id]
            
        # 2. Key variations
        if cleaned in ("cpp", "c plus plus", "c++"):
            return self.taxonomy.get("cpp")
        if cleaned in ("react", "reactjs", "react.js"):
            return self.taxonomy.get("react")
        if cleaned in ("node", "nodejs", "node.js"):
            return self.taxonomy.get("node_js")
        if cleaned in ("oops", "oop", "object oriented"):
            return self.taxonomy.get("oop")
        if cleaned in ("os", "operating systems", "operating system"):
            return self.taxonomy.get("operating_systems")
        if cleaned in ("dbms", "database", "rdbms"):
            return self.taxonomy.get("dbms")
        if cleaned in ("dsa", "algorithms", "data structures"):
            return self.taxonomy.get("dsa")
        if cleaned in ("cn", "networking", "computer networks"):
            return self.taxonomy.get("computer_networks")
            
        # 3. Substring match inside known aliases
        for alias, c_id in self.alias_map.items():
            if len(alias) >= 3 and alias in cleaned:
                return self.taxonomy[c_id]
                
        # Fallback custom representation
        slug = re.sub(r"\s+", "_", cleaned)
        return {
            "id": slug,
            "name": raw_skill.strip(),
            "category": "General",
            "aliases": [cleaned],
            "description": f"Technical skill: {raw_skill}",
            "keywords": [cleaned]
        }
