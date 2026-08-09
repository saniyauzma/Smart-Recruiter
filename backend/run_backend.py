import os
import sys
import uvicorn

# Add the backend directory to python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)
sys.path.append(os.path.join(backend_dir, "my_resume_match_project"))

if __name__ == "__main__":
    print("Starting Resume Matcher FastAPI Backend on http://localhost:8000")
    # Run the FastAPI app from the my_resume_match_project subdirectory
    uvicorn.run(
        "my_resume_match_project.app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
