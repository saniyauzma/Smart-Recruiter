import React, { useState } from 'react';
import axios from 'axios';
import { 
  Briefcase, 
  Mic, 
  ArrowLeft, 
  Upload, 
  Link, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Phone,
  Mail,
  User,
  X,
  FileText,
  Github,
  Twitter,
  Linkedin,
  ChevronRight,
  BrainCircuit,
  Database,
  Code
} from 'lucide-react';

const API_BASE = 'https://smart-recruiter-n4m8.onrender.com';

export default function App() {
  const [page, setPage] = useState('landing'); // landing, matcher, interview
  
  // Resume Matcher State
  const [jdFiles, setJdFiles] = useState([]);
  const [resumeFiles, setResumeFiles] = useState([]);
  const [matcherLoading, setMatcherLoading] = useState(false);
  const [matcherResult, setMatcherResult] = useState(null);
  const [matcherError, setMatcherError] = useState('');

  // Interview RAG State
  const [inputType, setInputType] = useState('url'); // url, file
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [interviewFile, setInterviewFile] = useState(null);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewResult, setInterviewResult] = useState('');
  const [interviewError, setInterviewError] = useState('');

  const goHome = () => {
    setPage('landing');
    setMatcherResult(null);
    setInterviewResult('');
    setMatcherError('');
    setInterviewError('');
  };

  // Run Resume Matcher
  const handleMatchSubmit = async (e) => {
    e.preventDefault();
    if (jdFiles.length === 0 || resumeFiles.length === 0) {
      setMatcherError('Please upload both Job Description and Resume files.');
      return;
    }
    
    setMatcherLoading(true);
    setMatcherError('');
    setMatcherResult(null);

    const formData = new FormData();
    for (let file of jdFiles) {
      formData.append('job_desc_files', file);
    }
    for (let file of resumeFiles) {
      formData.append('resume_files', file);
    }

    try {
      const response = await axios.post(`${API_BASE}/match`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000
      });
      setMatcherResult(response.data.match_report);
    } catch (err) {
      setMatcherError(err.response?.data?.detail || 'Failed to connect to backend server. Make sure python backend is running.');
    } finally {
      setMatcherLoading(false);
    }
  };

  // Run Interview RAG
  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (inputType === 'url' && !youtubeUrl) {
      setInterviewError('Please enter a valid YouTube URL.');
      return;
    }
    if (inputType === 'file' && !interviewFile) {
      setInterviewError('Please upload an audio or video file.');
      return;
    }

    setInterviewLoading(true);
    setInterviewError('');
    setInterviewResult('');

    const formData = new FormData();
    if (inputType === 'url') {
      formData.append('youtube_url', youtubeUrl);
    } else {
      formData.append('file', interviewFile);
    }

    try {
      const response = await axios.post(`${API_BASE}/analyze-interview`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000 // Transcription can take longer
      });
      setInterviewResult(response.data.summary);
    } catch (err) {
      setInterviewError(err.response?.data?.detail || 'Failed to analyze interview. Check audio file or YouTube captions.');
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Background shapes & noise */}
      <div className="bg-grid"></div>
      <div className="bg-noise"></div>
      <div className="glow-blur shape-1"></div>
      <div className="glow-blur shape-2"></div>
      <div className="glow-blur shape-3"></div>

      {/* Navbar */}
      <nav className="top-nav">
        <div className="nav-logo" onClick={goHome}>
          <Sparkles className="logo-icon" size={24} />
          <span className="logo-text">Smart Recruiter</span>
        </div>
        <div className="nav-links">
          <span className="badge-pill"><BrainCircuit size={14}/> Powered by AI</span>
        </div>
      </nav>

      <main className="main-content">

      {/* --- 1. LANDING PAGE --- */}
      {page === 'landing' && (
        <div className="landing-screen fade-in-stagger">
          <header className="hero-section">
            <div className="tech-stack-badges fade-in-up">
              <span className="tech-badge"><Code size={14}/> Groq</span>
              <span className="tech-badge"><BrainCircuit size={14}/> LangChain</span>
              <span className="tech-badge"><Database size={14}/> ChromaDB</span>
            </div>
            <h1 className="main-title reveal-text">Smart Recruiter</h1>
            <p className="main-subtitle typing-effect">AI-Driven Recruiting Pipeline & Candidate Diagnostics</p>
          </header>

          <div className="cards-grid">
            <div className="premium-card" onClick={() => setPage('matcher')}>
              <div className="card-badge pink-glow">Interactive Fit</div>
              <div className="icon-wrapper">
                <Briefcase className="icon-pink" size={32} />
              </div>
              <h2 className="card-title">Resume & JD Matcher</h2>
              <p className="card-description">
                Map candidate profiles against job requirements. Extract key technologies, calculate match scores, and generate structured compatibility analytics.
              </p>
              <button className="card-action-btn pink-btn">Open Matcher</button>
            </div>

            <div className="premium-card" onClick={() => setPage('interview')}>
              <div className="card-badge blue-glow">AI RAG Search</div>
              <div className="icon-wrapper">
                <Mic className="icon-blue" size={32} />
              </div>
              <h2 className="card-title">Interview Analysis (RAG)</h2>
              <p className="card-description">
                Transcribe interview recordings or load YouTube videos. Embed and query answers using Chroma vector store to audit core candidate communication styles.
              </p>
              <button className="card-action-btn blue-btn">Open Interview RAG</button>
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-title">Revolutionizing Talent Acquisition with AI</h2>
            <p className="about-text">
              Smart Recruiter is an advanced AI-powered platform designed to streamline and elevate the hiring process. 
              By leveraging cutting-edge Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG), 
              it empowers HR professionals to make objective, data-driven decisions with unprecedented speed and accuracy.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon-wrapper pink-bg">
                  <CheckCircle2 size={24} color="#ec4899" />
                </div>
                <div className="feature-content">
                  <h3>Objective Evaluation</h3>
                  <p>Eliminate human bias with AI-driven resume scoring against exact job requirements.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper blue-bg">
                  <Sparkles size={24} color="#3b82f6" />
                </div>
                <div className="feature-content">
                  <h3>Deep Interview Analysis</h3>
                  <p>Query candidate video interviews directly using semantic search and vector databases.</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon-wrapper purple-bg">
                  <Briefcase size={24} color="#a855f7" />
                </div>
                <div className="feature-content">
                  <h3>Comprehensive Reporting</h3>
                  <p>Generate detailed, explainable match reports for skills, education, and experience.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- 2. RESUME MATCHER UI --- */}
      {page === 'matcher' && (
        <div className="subpage-screen fade-in">
          <button className="back-btn" onClick={goHome}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <h2 className="page-header pink-gradient-text">Resume & Job Description Matcher</h2>
          <p className="page-subtitle">Verify skill compatibility, technical alignment, and experience fit</p>

          <form onSubmit={handleMatchSubmit} className="form-container">
            <div className="upload-row">
              <div className="upload-box">
                <label className="upload-label">
                  <Briefcase size={24} className="mb-2 text-indigo-400" />
                  <span>Job Descriptions</span>
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => setJdFiles(Array.from(e.target.files))}
                    className="hidden-file-input"
                  />
                </label>
                {jdFiles.length > 0 && (
                  <div className="file-list">
                    {jdFiles.map((f, i) => (
                      <div key={i} className="file-item">
                        <FileText size={16} className="file-icon" />
                        <span className="file-name">{f.name}</span>
                        <X size={16} className="file-remove" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="upload-box">
                <label className="upload-label">
                  <User size={24} className="mb-2 text-indigo-400" />
                  <span>Candidate Resumes</span>
                  <input 
                    type="file" 
                    multiple 
                    onChange={(e) => setResumeFiles(Array.from(e.target.files))}
                    className="hidden-file-input"
                  />
                </label>
                {resumeFiles.length > 0 && (
                  <div className="file-list">
                    {resumeFiles.map((f, i) => (
                      <div key={i} className="file-item">
                        <FileText size={16} className="file-icon" />
                        <span className="file-name">{f.name}</span>
                        <X size={16} className="file-remove" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {matcherError && (
              <div className="error-alert">
                <AlertCircle size={18} /> <span>{matcherError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn pink-gradient-btn"
              disabled={matcherLoading}
            >
              {matcherLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Processing with AI Model...
                </>
              ) : (
                'Run Compatibility Audit'
              )}
            </button>
          </form>

          {/* Results section */}
          {matcherResult && (
            <div className="results-wrapper fade-in">
              <h3 className="section-title"><Sparkles size={20} className="icon-pink inline mr-2" /> Match Results</h3>
              <div className="metrics-layout">
                <div className="overall-score-card">
                  <div className="overall-val">{matcherResult.overall_match_score}%</div>
                  <div className="overall-lbl">Overall Match Fit</div>
                </div>

                <div className="metrics-grid">
                  <div className="grid-card">
                    <div className="grid-card-val">{matcherResult.skills_match_percentage}%</div>
                    <div className="grid-card-lbl">Skills Match</div>
                  </div>
                  <div className="grid-card">
                    <div className="grid-card-val">{matcherResult.experience_match_percentage}%</div>
                    <div className="grid-card-lbl">Experience Fit</div>
                  </div>
                  <div className="grid-card">
                    <div className="grid-card-val">{matcherResult.education_match_percentage}%</div>
                    <div className="grid-card-lbl">Education Match</div>
                  </div>
                  <div className="grid-card">
                    <div className="grid-card-val">{matcherResult.technologies_match_percentage}%</div>
                    <div className="grid-card-lbl">Technology Alignment</div>
                  </div>
                </div>
              </div>

              <div className="report-card">
                <h4>Detailed Fit Analysis</h4>
                <p className="analysis-text">{matcherResult.analysis}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- 3. INTERVIEW RAG UI --- */}
      {page === 'interview' && (
        <div className="subpage-screen fade-in">
          <button className="back-btn" onClick={goHome}>
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <h2 className="page-header blue-gradient-text">Candidate Interview Analysis (RAG)</h2>
          <p className="page-subtitle">Transcribe audio responses and query communication styles using vector databases</p>

          <form onSubmit={handleInterviewSubmit} className="form-container">
            <div className="toggle-tabs">
              <button 
                type="button" 
                className={`tab-btn ${inputType === 'url' ? 'active-tab' : ''}`}
                onClick={() => setInputType('url')}
              >
                <Link size={16} /> YouTube URL
              </button>
              <button 
                type="button" 
                className={`tab-btn ${inputType === 'file' ? 'active-tab' : ''}`}
                onClick={() => setInputType('file')}
              >
                <Upload size={16} /> Upload Audio/Video
              </button>
            </div>

            {inputType === 'url' ? (
              <div className="input-field-group">
                <input 
                  type="text" 
                  placeholder="https://www.youtube.com/watch?v=..." 
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="text-input-field"
                />
              </div>
            ) : (
              <div className="upload-box single-box">
                <label className="upload-label">
                  <Mic size={24} className="mb-2 text-indigo-400" />
                  <span>Interview Media File (MP3, MP4, WAV, AVI)</span>
                  <input 
                    type="file" 
                    onChange={(e) => setInterviewFile(e.target.files[0])}
                    className="hidden-file-input"
                  />
                </label>
                {interviewFile && (
                  <div className="file-list">
                    <div className="file-item">
                      <FileText size={16} className="file-icon" />
                      <span className="file-name">{interviewFile.name}</span>
                      <X size={16} className="file-remove" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {interviewError && (
              <div className="error-alert">
                <AlertCircle size={18} /> <span>{interviewError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="submit-btn blue-gradient-btn"
              disabled={interviewLoading}
            >
              {interviewLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} /> Transcribing & Vectorizing...
                </>
              ) : (
                'Run Interview Analysis'
              )}
            </button>
          </form>

          {/* RAG Results */}
          {interviewResult && (
            <div className="results-wrapper fade-in">
              <h3 className="section-title"><Sparkles size={20} className="icon-blue inline mr-2" /> Evaluation Summary</h3>
              <div className="report-card RAG-report">
                <h4>Candidate Performance Analytics</h4>
                <p className="analysis-text white-space-pre">{interviewResult}</p>
              </div>
            </div>
          )}
        </div>
      )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Sparkles className="logo-icon" size={20} />
            <span className="logo-text">Smart Recruiter</span>
          </div>
          <p className="footer-copy">© 2026 Smart Recruiter. All rights reserved.</p>
          <div className="footer-socials">
            <Github size={18} />
            <Twitter size={18} />
            <Linkedin size={18} />
          </div>
        </div>
      </footer>
    </div>
  );
}
