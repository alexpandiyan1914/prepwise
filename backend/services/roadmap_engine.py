from typing import List, Dict, Any

class RoadmapEngine:
    @staticmethod
    def generate_5_day_roadmap(
        recommendations: List[Dict[str, Any]],
        daily_hours: float = 3.0
    ) -> List[Dict[str, Any]]:
        if not recommendations:
            return []

        top_recs = recommendations[:5]
        roadmap = []

        day_topics = [
            {"title": "Placement Diagnostic & Foundation Primer", "c_id": "general"},
            {"title": "High-Yield Topic Deep Dive", "c_id": "general"},
            {"title": "System & Architectural Concepts", "c_id": "general"},
            {"title": "Advanced Placement Problem Solving", "c_id": "general"},
            {"title": "Interview Simulation & Revision", "c_id": "general"}
        ]

        for idx in range(min(5, len(top_recs))):
            rec = top_recs[idx]
            day_topics[idx] = {
                "title": f"{rec['skill_name']}: {RoadmapEngine._get_daily_focus_title(rec['canonical_id'], idx + 1)}",
                "c_id": rec["canonical_id"],
                "rec": rec
            }

        for i in range(5):
            day_info = day_topics[i]
            rec = day_info.get("rec")
            c_id = day_info.get("c_id", "general")

            if rec:
                skill = rec["skill_name"]
                priority = rec["priority"]
                focus_items = RoadmapEngine._get_day_focus_items(c_id, i + 1)
                action_items = RoadmapEngine._get_day_action_items(c_id, i + 1, daily_hours)
                title = f"Day {i + 1}: {skill} - {RoadmapEngine._get_daily_focus_title(c_id, i + 1)}"
            else:
                priority = "MEDIUM"
                title = f"Day {i + 1}: General Technical Placement Drills"
                focus_items = ["Core language syntax", "Time & Space complexity analysis"]
                action_items = [f"Spend {daily_hours}h practicing coding problems on LeetCode/GeeksforGeeks."]

            roadmap.append({
                "day_number": i + 1,
                "title": title,
                "canonical_id": c_id,
                "focus_topics": focus_items,
                "action_items": action_items,
                "estimated_hours": daily_hours,
                "priority": priority
            })

        return roadmap

    @staticmethod
    def _get_daily_focus_title(c_id: str, day: int) -> str:
        titles = {
            "dsa": {1: "Arrays, Strings & Two Pointers", 2: "Trees & Binary Search Trees", 3: "Graphs & BFS/DFS Traversals", 4: "Dynamic Programming & Recursion", 5: "Mock Placement Coding Sprint"},
            "operating_systems": {1: "Process Lifecycle & CPU Scheduling", 2: "Threads & Concurrency (Mutex/Semaphores)", 3: "Deadlock Detection & Prevention", 4: "Memory Management & Paging", 5: "Top 30 OS Interview Scenarios"},
            "dbms": {1: "Relational Schema & Key Constraints", 2: "SQL Joins & Complex Group By Queries", 3: "Database Normalization (1NF to BCNF)", 4: "Transactions & ACID Isolation Levels", 5: "Indexing, B-Trees & Query Optimization"},
            "oop": {1: "Classes, Objects & Encapsulation", 2: "Inheritance & Polymorphism in Practice", 3: "Abstraction & Interface Design", 4: "SOLID Principles & Common LLD Patterns", 5: "Object-Oriented Design Interview Problems"},
            "computer_networks": {1: "OSI vs TCP/IP Architecture", 2: "TCP 3-Way Handshake & Flow Control", 3: "HTTP, HTTPS, TLS & Web Sockets", 4: "DNS Resolution, IP Routing & Subnetting", 5: "Network Troubleshooting & Interview Q&A"},
            "react": {1: "Component Hierarchy & Props/State", 2: "React Hooks (useState, useEffect, useRef)", 3: "Custom Hooks & State Lifting", 4: "Performance Optimization & Context API", 5: "Interactive Frontend UI Component Build"}
        }
        return titles.get(c_id, {}).get(day, f"Module {day}: Core Interview Readiness")

    @staticmethod
    def _get_day_focus_items(c_id: str, day: int) -> List[str]:
        items_map = {
            "dsa": ["Binary Search", "Tree traversals", "Graph cycles", "Sliding window technique"],
            "operating_systems": ["CPU Scheduling algorithms", "Mutex vs Semaphore", "Paging & TLB", "Inter-Process Communication"],
            "dbms": ["ER Diagrams", "BCNF vs 3NF", "ACID properties", "B+ Tree Indexing"],
            "oop": ["Method Overriding vs Overloading", "Abstract classes", "Single Responsibility Principle", "Singleton Pattern"],
            "react": ["Virtual DOM diffing", "Hook dependency arrays", "State immutability", "Component re-rendering"],
            "python": ["List comprehensions", "Generators & iterators", "Decorator functions", "GIL & multithreading"]
        }
        return items_map.get(c_id, ["Fundamental Concepts", "Practice Problems", "Interview Scenarios"])

    @staticmethod
    def _get_day_action_items(c_id: str, day: int, hours: float) -> List[str]:
        return [
            f"Dedicate {round(hours * 0.4, 1)}h to conceptual theory and architectural diagrams.",
            f"Spend {round(hours * 0.6, 1)}h solving targeted practice problems and reviewing interview flashcards."
        ]
