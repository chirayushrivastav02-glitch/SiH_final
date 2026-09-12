import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pathlib import Path

# Load data on startup
DATA_PATH = Path(__file__).parent.parent / "data" / "past_sih_challenges.csv"

class RAGRetriever:
    def __init__(self):
        try:
            self.df = pd.read_csv(DATA_PATH)
            # Create a combined text column for retrieval
            self.df["combined_text"] = self.df["domain"] + " " + self.df["problem_statement"]
            
            # Initialize TF-IDF
            self.vectorizer = TfidfVectorizer(stop_words="english")
            self.tfidf_matrix = self.vectorizer.fit_transform(self.df["combined_text"])
        except Exception as e:
            print(f"Warning: Could not initialize RAG retriever. {e}")
            self.df = pd.DataFrame()

    def get_relevant_context(self, domain: str, proposed_solution: str, top_k: int = 2) -> str:
        if self.df.empty:
            return "No historical context available."

        query = f"{domain} {proposed_solution}"
        query_vec = self.vectorizer.transform([query])
        
        # Calculate cosine similarity
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get top_k indices
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        context_parts = []
        for idx in top_indices:
            row = self.df.iloc[idx]
            context_parts.append(
                f"- Past Problem: {row['problem_statement']}\n"
                f"  Common Failures: {row['common_failure_points']}\n"
                f"  Edge Cases: {row['edge_cases']}"
            )
            
        return "\n\n".join(context_parts)

# Singleton instance
retriever = RAGRetriever()
