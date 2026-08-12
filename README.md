# AI-Powered Recruitment & Candidate Analysis Platform

An intelligent system for automating resume-to-job-description matching and analyzing candidate interview performance using advanced NLP and LLM technologies.

---

## 🚀 Deployed Applications

- **Frontend Client (Vercel)**: https://smart-recruiter-ai.vercel.app
- **Backend API (Render)**: https://smart-recruiter-n4m8.onrender.com
- **API Documentation (Swagger)**: https://smart-recruiter-n4m8.onrender.com/docs

---

## 📋 Project Overview

This project consists of two main components:

### 1. **Resume Matcher** (FastAPI)
- Compares job descriptions with resumes
- Extracts structured data using LLama Parse and LLMs
- Calculates match percentages across:
  - Skills match
  - Experience match
  - Education match
  - Technologies match
- Returns overall match score (0-100) with detailed analysis

### 2. **Interview Analysis** (Streamlit)
- Transcribes audio/video interviews or YouTube videos
- Creates semantic embeddings for content
- Analyzes candidate qualities:
  - Communication style & clarity
  - Active listening skills
  - Engagement & rapport
- Generates comprehensive performance summary

---

## 🛠️ Technologies & Tools

| Category | Technology |
|----------|-----------|
| **Web Framework** | FastAPI, Streamlit |
| **LLM/AI** | Groq (mixtral-8x7b), LangChain |
| **Document Parsing** | LlamaParse, llama-index-core |
| **Embeddings** | Cohere Embeddings |
| **Vector Store** | Chroma |
| **Transcription** | AssemblyAI |
| **Language** | Python 3.13 |

---

## 📦 Installation

### Prerequisites
- Python 3.8+
- API keys for:
  - `GROQ_API_KEY` — for LLM inference
  - `LLAMA_CLOUD_API_KEY` — for document parsing
  - `COHERE_API_KEY` — for embeddings
  - `ASSEMBLYAI_API_KEY` — for transcription

### Setup Steps

1. **Clone/extract the project**
   ```bash
   cd your_project_directory
   ```

2. **Create virtual environment** (optional but recommended)
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   GROQ_API_KEY=your_groq_api_key
   LLAMA_CLOUD_API_KEY=your_llama_cloud_api_key
   COHERE_API_KEY=your_cohere_api_key
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

---

## 🚀 Running the Project

### Option 1: Run Both Services

**Terminal 1 - FastAPI Resume Matcher:**
```bash
cd my_resume_match_project
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```
- API URL: `http://localhost:8000`
- Interactive Docs: `http://localhost:8000/docs`

**Terminal 2 - Streamlit Interview Analyzer:**
```bash
cd final_rag_approach
streamlit run app.py
```
- Web UI: `http://localhost:8501`

### Option 2: Run Individual Components

**Resume Matcher Standalone:**
```bash
cd my_resume_match_project
python main.py
```
(Update file paths in `main.py` first)

**Interview Analyzer Standalone:**
```bash
cd final_rag_approach
python main.py
```

---

## 📝 API Usage

### Resume Matcher Endpoint

**Endpoint:** `POST /match`

**Request:**
```bash
curl -X POST "http://localhost:8000/match" \
  -F "job_desc_files=@job_description.txt" \
  -F "resume_files=@resume.txt"
```

**Response:**
```json
{
  "match_report": {
    "skills_match_percentage": 85.5,
    "experience_match_percentage": 90.0,
    "education_match_percentage": 75.0,
    "technologies_match_percentage": 88.0,
    "overall_match_score": 84.6,
    "analysis": "Candidate demonstrates strong alignment with technical requirements..."
  }
}
```

**Supported File Types:**
- `.txt`, `.pdf`, `.docx`, `.json`

---

## 📁 Project Structure

```
Smart-Recruiter/
├── README.md                           # This file
├── .env                                # Environment variables (not in repo)
│
├── backend/                            # FastAPI Backend (Render)
│   ├── api.py                          # Main FastAPI application & endpoints
│   ├── requirements.txt                # Backend dependencies
│   ├── my_resume_match_project/        # Resume Matcher module
│   │   ├── jd_parser.py                # Job description parser
│   │   ├── resume_parser.py            # Resume parser
│   │   └── matched_score.py            # Match scoring logic
│   └── final_rag_approach/             # RAG Interview Analyzer module
│       ├── embeddings.py               # Embedding creation
│       ├── similarity.py               # Semantic similarity search
│       └── traanscriber.py             # Transcription handler
│
└── frontend/                           # React + Vite Frontend (Vercel)
    ├── package.json                    # Frontend dependencies
    ├── index.html                      # App entry point
    ├── vite.config.js                  # Vite configuration
    └── src/
        ├── App.jsx                     # Main React component & UI
        ├── index.css                   # Global styling & glassmorphism
        └── main.jsx                    # React entry point
```

---

## 🔧 Configuration

### Environment Variables
All API keys should be added to `.env` file. Example:

```env
# Groq API (LLM inference)
GROQ_API_KEY=gsk_...

# LlamaParse (document parsing)
LLAMA_CLOUD_API_KEY=llx-...

# Cohere (embeddings)
COHERE_API_KEY=...

# AssemblyAI (transcription)
ASSEMBLYAI_API_KEY=...

# OpenAI (optional)
OPENAI_API_KEY=sk-...
```

### Model Configuration
Current Groq model: `mixtral-8x7b`

To change the model, update in these files:
- `my_resume_match_project/jd_parser.py` (line 16)
- `my_resume_match_project/resume_parser.py` (line 19)
- `my_resume_match_project/matched_score.py` (line 10)
- `final_rag_approach/similarity.py` (line 30)

---

## 📊 How It Works

### Resume Matching Flow
1. Upload job description & resume files
2. Parse documents using LlamaParse
3. Extract structured data with Groq LLM
4. Compare extracted features
5. Calculate match percentages
6. Return comprehensive analysis

### Interview Analysis Flow
1. Upload audio/video or YouTube URL
2. Transcribe content using AssemblyAI
3. Create text embeddings (Cohere)
4. Store in Chroma vector database
5. Perform semantic similarity search
6. Summarize relevant content with Groq LLM
7. Display candidate analysis

---

## 🐛 Troubleshooting

### API Key Errors
- Ensure `.env` file exists in project root
- Check all API keys are valid
- Verify no extra spaces around `=` in `.env`

### Model Deprecated Error
- Check Groq documentation for available models
- Update model name in configuration files
- Current model: `mixtral-8x7b`

### Port Already in Use
- FastAPI default: `8000` → change with `--port`
- Streamlit default: `8501` → set `STREAMLIT_SERVER_PORT`

### Transcription Fails
- Verify AssemblyAI API key
- Check file format/size (max 200MB per Streamlit default)
- For YouTube: ensure video is accessible

---

## 📝 Notes

- The project uses async file processing for efficient uploads
- Vector store (Chroma) is created in-memory for each session
- All temp files are cleaned up automatically
- LLM responses are cached for 5 retries before failing

---

## 📄 License

This project is provided as-is for recruitment and analysis purposes.

---

## 📞 Support

For issues:
1. Check `.env` configuration
2. Verify all API keys are valid
3. Review terminal output for error messages
4. Check internet connectivity and API availability

---

## 🚀 Future Enhancements

- Database integration for persistent storage
- Batch processing for multiple resumes
- Advanced analytics dashboard
- Custom evaluation criteria
- Multi-language support
- Enhanced security & authentication
