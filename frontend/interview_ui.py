import sys
import os
import streamlit as st

# Add the backend directories to the path so the RAG app can resolve imports
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
rag_dir = os.path.join(backend_dir, "final_rag_approach")

sys.path.append(backend_dir)
sys.path.append(rag_dir)

# Import the unchanged main RAG Streamlit app
import app as interview_rag

if __name__ == "__main__":
    # Call the unmodified main function of the interview RAG app
    interview_rag.main()
