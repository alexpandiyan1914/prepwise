import os
from typing import Tuple
import numpy as np

class SemanticMatcher:
    def __init__(self):
        self.model = None
        self.method_used = "Taxonomy & Cosine Similarity"
        self._initialize_model()

    def _initialize_model(self):
        # LEVEL 1: Sentence Transformers (if available)
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            self.method_used = "Sentence Transformers (Embeddings)"
            return
        except Exception:
            pass

        # LEVEL 2: scikit-learn TF-IDF Vectorizer + Cosine Similarity
        try:
            from sklearn.feature_extraction.text import TfidfVectorizer
            from sklearn.metrics.pairwise import cosine_similarity
            self.vectorizer_cls = TfidfVectorizer
            self.cosine_func = cosine_similarity
            self.method_used = "TF-IDF & Cosine Similarity"
            return
        except Exception:
            pass

        # LEVEL 3: Taxonomy & Synonym Heuristic Fallback
        self.method_used = "Taxonomy & Synonym Heuristic"

    def compute_similarity(self, text_a: str, text_b: str, canonical_match: bool = False) -> float:
        base = 0.88 if canonical_match else 0.0

        if not text_a or not text_b:
            return base

        # Level 1: Model embeddings
        if self.model is not None:
            try:
                embeddings = self.model.encode([text_a, text_b])
                denom = (np.linalg.norm(embeddings[0]) * np.linalg.norm(embeddings[1])) + 1e-9
                cos_sim = float(np.dot(embeddings[0], embeddings[1]) / denom)
                sim = max(0.0, min(1.0, cos_sim))
                return max(sim, base)
            except Exception:
                pass

        # Level 2: TF-IDF
        try:
            vec = self.vectorizer_cls(ngram_range=(1, 2))
            mat = vec.fit_transform([text_a, text_b])
            cos = float(self.cosine_func(mat[0:1], mat[1:2])[0][0])
            sim = max(0.0, min(1.0, cos))
            return max(sim, base)
        except Exception:
            pass

        # Level 3: Token Jaccard overlap
        tokens_a = set(text_a.lower().split())
        tokens_b = set(text_b.lower().split())
        intersection = tokens_a.intersection(tokens_b)
        union = tokens_a.union(tokens_b)
        jaccard = len(intersection) / len(union) if union else 0.0
        return max(jaccard, base)

    def classify_similarity(self, score: float) -> str:
        if score >= 0.80:
            return "STRONG_MATCH"
        elif score >= 0.60:
            return "PARTIAL_MATCH"
        elif score >= 0.40:
            return "WEAK"
        else:
            return "MISSING"
