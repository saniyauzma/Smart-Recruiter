import os
import sys
import uvicorn

# Add the backend directory to python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)
sys.path.append(os.path.join(backend_dir, "my_resume_match_project"))

if __name__ == "__main__":
    print("Starting Unified Smart Recruiter FastAPI Backend on http://localhost:8000")
    # Run the unified FastAPI app
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
