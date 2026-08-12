import os
import sys
import shutil
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add component directories to path to resolve imports
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)
sys.path.append(os.path.join(backend_dir, "my_resume_match_project"))
sys.path.append(os.path.join(backend_dir, "final_rag_approach"))

# Import functions from unchanged components
from jd_parser import process_and_extract_job_details
from resume_parser import process_and_extract_resume_details
from matched_score import calculate_match_with_llm

from traanscriber import transcribe_content
from embeddings import create_vector_store
from similarity import get_most_relevant_document_and_summarize

app = FastAPI(title="Smart Recruiter API")

# Enable CORS for frontend communication (React dev server on 5173 or 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(backend_dir, "temp_api_uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

async def save_upload(file: UploadFile) -> str:
    path = os.path.join(TEMP_DIR, file.filename)
    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return path

@app.post("/match")
async def match_resume_jd(
    job_desc_files: List[UploadFile] = File(...),
    resume_files: List[UploadFile] = File(...),
):
    try:
        jd_paths = []
        for file in job_desc_files:
            jd_paths.append(await save_upload(file))

        resume_paths = []
        for file in resume_files:
            resume_paths.append(await save_upload(file))

        # Run extraction
        job_requirements = process_and_extract_job_details(jd_paths)
        resume_details = process_and_extract_resume_details(resume_paths)

        # Cleanup files
        for path in jd_paths + resume_paths:
            try:
                os.remove(path)
            except:
                pass

        if not job_requirements or not resume_details:
            raise HTTPException(status_code=400, detail="Failed to extract job or resume details.")

        # Match score
        match_report = calculate_match_with_llm(job_requirements[0], resume_details[0])
        return {"match_report": match_report}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-interview")
async def analyze_interview(
    youtube_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    try:
        source = None
        if youtube_url:
            source = youtube_url
        elif file:
            source = await save_upload(file)
        
        if not source:
            raise HTTPException(status_code=400, detail="Must provide either a YouTube URL or an uploaded audio/video file.")

        # Transcription
        transcription = transcribe_content(source)

        # Cleanup uploaded media file
        if file and os.path.exists(source):
            try:
                os.remove(source)
            except:
                pass

        if not transcription or "Error" in transcription:
            raise HTTPException(status_code=400, detail="Failed to transcribe the audio or video content.")

        # RAG pipeline
        vectorstore = create_vector_store(transcription)
        
        predefined_query = """
        Retrieve and summarize parts of the interview where the candidate demonstrates:
        - Clear and effective communication in expressing their thoughts.
        - Attentiveness and responsiveness to the interviewer's questions (active listening).
        - Engagement with the interviewer, showing rapport, enthusiasm, and a balanced conversation.
        """
        
        summarized_result = get_most_relevant_document_and_summarize(predefined_query, transcription, vectorstore)
        return {"summary": summarized_result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
