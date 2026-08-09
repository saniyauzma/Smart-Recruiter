import streamlit as st
import httpx

st.set_page_config(page_title="Resume Matcher Client", page_icon="💼")

st.title("💼 Minimal Resume Matcher")
st.markdown("This minimal interface communicates with the FastAPI backend to match resumes against job descriptions.")

# File uploaders
job_desc_files = st.file_uploader("Upload Job Description(s)", type=["pdf", "txt", "json"], accept_multiple_files=True)
resume_files = st.file_uploader("Upload Resume(s)", type=["pdf", "txt", "json"], accept_multiple_files=True)

if st.button("Calculate Match Fit"):
    if not job_desc_files or not resume_files:
        st.warning("Please upload both job description and resume files.")
    else:
        with st.spinner("Processing files and calculating match score..."):
            try:
                # Prepare files for multipart POST request
                files = []
                for f in job_desc_files:
                    files.append(("job_desc_files", (f.name, f.read(), f.type)))
                for f in resume_files:
                    files.append(("resume_files", (f.name, f.read(), f.type)))

                # Call the FastAPI backend endpoint
                response = httpx.post("http://localhost:8000/match", files=files, timeout=60.0)
                
                if response.status_code == 200:
                    report = response.json().get("match_report", {})
                    st.success("Match Calculation Complete!")
                    
                    # Display results
                    st.metric("Overall Match Score", f"{report.get('overall_match_score', 0)}%")
                    
                    st.markdown("### Match Breakdown:")
                    col1, col2 = st.columns(2)
                    col1.metric("Skills Match", f"{report.get('skills_match_percentage', 0)}%")
                    col1.metric("Experience Match", f"{report.get('experience_match_percentage', 0)}%")
                    col2.metric("Education Match", f"{report.get('education_match_percentage', 0)}%")
                    col2.metric("Technologies Match", f"{report.get('technologies_match_percentage', 0)}%")
                    
                    st.markdown("### Detailed Match Analysis:")
                    st.write(report.get("analysis", "No detailed analysis provided."))
                else:
                    st.error(f"Backend returned an error: {response.text}")
            except Exception as e:
                st.error(f"Could not connect to backend server: {e}")
                st.info("Make sure the backend is running by executing: python backend/run_backend.py")
