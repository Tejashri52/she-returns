"""Backend tests for ReLaunch AI API.
Covers: health, resume (enhance + upload), skills analyze, interview questions/feedback,
story generation, chat + history, progress update/get.
"""
import io
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://she-returns.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
# AI endpoints can be slow (5-30s)
AI_TIMEOUT = 90


@pytest.fixture(scope="module")
def session_id():
    return f"test-session-{uuid.uuid4()}"


# ---------- Health ----------
def test_root_health():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "ok"
    assert "message" in data


# ---------- Resume Upload ----------
def test_resume_upload_txt():
    content = b"Jane Doe\nSoftware Engineer\n5 years Python experience."
    files = {"file": ("resume.txt", io.BytesIO(content), "text/plain")}
    r = requests.post(f"{API}/resume/upload", files=files, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["filename"] == "resume.txt"
    assert "Jane Doe" in data["text"]
    assert isinstance(data["chars"], int) and data["chars"] > 0


def test_resume_upload_unsupported():
    files = {"file": ("bad.xyz", io.BytesIO(b"abc"), "application/octet-stream")}
    r = requests.post(f"{API}/resume/upload", files=files, timeout=30)
    assert r.status_code == 400


# ---------- Resume Enhance (AI) ----------
def test_resume_enhance():
    payload = {
        "resume_text": "Priya Sharma\nProduct Manager at ABC Corp (2015-2020). Led cross-functional team of 8. Launched 3 products.",
        "career_break_duration": "3 years",
        "break_reason": "childcare",
        "target_role": "Senior Product Manager",
    }
    r = requests.post(f"{API}/resume/enhance", json=payload, timeout=AI_TIMEOUT)
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data["enhanced_resume"], str) and len(data["enhanced_resume"]) > 50
    assert isinstance(data["improvements"], list) and len(data["improvements"]) >= 1
    assert isinstance(data["career_break_reframed"], str) and len(data["career_break_reframed"]) > 10
    assert isinstance(data["confidence_note"], str)


# ---------- Skills Analyze (AI) ----------
def test_skills_analyze():
    payload = {
        "target_role": "Data Analyst",
        "current_skills": ["Excel", "SQL", "Communication"],
        "years_experience": "4",
    }
    r = requests.post(f"{API}/skills/analyze", json=payload, timeout=AI_TIMEOUT)
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data["missing_skills"], list) and len(data["missing_skills"]) >= 1
    first = data["missing_skills"][0]
    assert {"name", "priority", "why", "resource"}.issubset(first.keys())
    assert first["priority"] in ["high", "medium", "low"]
    assert isinstance(data["matched_skills"], list)
    assert isinstance(data["learning_path"], list) and len(data["learning_path"]) >= 1
    assert isinstance(data["estimated_weeks"], int)


# ---------- Interview Questions (AI) ----------
@pytest.fixture(scope="module")
def interview_question():
    payload = {"target_role": "Marketing Manager", "include_break_question": True}
    r = requests.post(f"{API}/interview/questions", json=payload, timeout=AI_TIMEOUT)
    assert r.status_code == 200, r.text
    data = r.json()
    qs = data["questions"]
    assert isinstance(qs, list) and len(qs) >= 4
    for q in qs:
        assert q["id"] and q["question"] and q["category"]
    return qs[0]["question"]


def test_interview_questions_count(interview_question):
    # fixture runs and validates; this test just asserts the fixture ran
    assert isinstance(interview_question, str) and len(interview_question) > 5


# ---------- Interview Feedback (AI) ----------
def test_interview_feedback(interview_question):
    payload = {
        "question": interview_question,
        "answer": "I led a campaign that increased engagement by 25% by focusing on our key audience segments and iterating based on weekly analytics.",
        "target_role": "Marketing Manager",
    }
    r = requests.post(f"{API}/interview/feedback", json=payload, timeout=AI_TIMEOUT)
    assert r.status_code == 200, r.text
    data = r.json()
    assert 1 <= data["score"] <= 10
    assert isinstance(data["strengths"], list) and len(data["strengths"]) >= 1
    assert isinstance(data["improvements"], list)
    assert isinstance(data["improved_answer"], str) and len(data["improved_answer"]) > 20
    assert isinstance(data["confidence_tip"], str)


# ---------- Story Generate (AI) ----------
def test_story_generate():
    payload = {
        "experiences": "Managed household budget, organized school volunteer events for 200+ parents, learned web design via Coursera, mentored younger family members in learning English.",
        "career_break_duration": "4 years",
    }
    r = requests.post(f"{API}/story/generate", json=payload, timeout=AI_TIMEOUT)
    assert r.status_code == 200, r.text
    data = r.json()
    assert isinstance(data["transferable_skills"], list) and len(data["transferable_skills"]) >= 3
    assert isinstance(data["resume_statements"], list) and len(data["resume_statements"]) >= 1
    assert isinstance(data["elevator_pitch"], str) and len(data["elevator_pitch"]) > 30


# ---------- Chat + History ----------
def test_chat_and_history(session_id):
    r = requests.post(
        f"{API}/chat",
        json={"session_id": session_id, "message": "I'm nervous about returning to work after 5 years. Any advice?"},
        timeout=AI_TIMEOUT,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["session_id"] == session_id
    assert isinstance(data["reply"], str) and len(data["reply"]) > 10

    # Verify persistence
    h = requests.get(f"{API}/chat/history/{session_id}", timeout=30)
    assert h.status_code == 200
    hist = h.json()
    assert isinstance(hist, list)
    assert len(hist) >= 2
    roles = [m["role"] for m in hist]
    assert "user" in roles and "assistant" in roles
    for m in hist:
        assert m["content"] and m["timestamp"]


# ---------- Progress ----------
def test_progress_update_and_get(session_id):
    r = requests.post(
        f"{API}/progress/update",
        json={"session_id": session_id, "step": "resume", "done": True},
        timeout=30,
    )
    assert r.status_code == 200, r.text
    data = r.json()
    assert data.get("steps", {}).get("resume") is True

    g = requests.get(f"{API}/progress/{session_id}", timeout=30)
    assert g.status_code == 200
    gdoc = g.json()
    assert gdoc["steps"]["resume"] is True


def test_progress_get_new_session():
    sid = f"new-{uuid.uuid4()}"
    r = requests.get(f"{API}/progress/{sid}", timeout=30)
    assert r.status_code == 200
    assert r.json() == {"session_id": sid, "steps": {}}
