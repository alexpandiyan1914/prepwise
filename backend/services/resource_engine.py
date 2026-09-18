import json
from pathlib import Path
from typing import List, Dict, Any

class ResourceEngine:
    def __init__(self, resource_file: str = None):
        if not resource_file:
            resource_file = str(Path(__file__).parent.parent / "data" / "resources.json")
            
        self.resources_path = Path(resource_file)
        self.resources_map = {}
        self._load_resources()

    def _load_resources(self):
        if self.resources_path.exists():
            with open(self.resources_path, "r", encoding="utf-8") as f:
                self.resources_map = json.load(f)

    def get_resources_for_skill(self, canonical_id: str, preferred_types: List[str] = None) -> List[Dict[str, Any]]:
        items = list(self.resources_map.get(canonical_id, []))
        if not items:
            title_name = canonical_id.replace("_", " ").title()
            return [{
                "title": f"{title_name} Technical Placement Revision & Practice",
                "provider": "GeeksforGeeks / Official Docs",
                "resource_type": "Documentation",
                "url": "https://www.geeksforgeeks.org/",
                "difficulty": "Intermediate",
                "estimated_hours": 4.0,
                "description": "Comprehensive placement revision notes and interview questions."
            }]

        if preferred_types:
            pref_set = {p.lower() for p in preferred_types}
            items.sort(key=lambda r: 0 if r.get("resource_type", "").lower() in pref_set else 1)

        return items
