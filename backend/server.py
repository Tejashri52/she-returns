from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import io
import json
import re
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage
import PyPDF2
from docx import Document

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ['EMERGENT_LLM_KEY']

app = FastAPI(title="ReLaunch AI")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ========= Helpers =========
def new_chat(session_id: str, system_message: str, model: str = "gpt-5.2") -> LlmChat:
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system_message,
    ).with_model("openai", model)


def extract_json(text: str) -> dict:
    """Extract JSON from LLM response, handling code fences."""
    text = text.strip()
    # Try direct parse first
    try:
        return json.loads(text)
    except Exception:
        pass
    # Look for ```json ... ``` block
    m = re.search(r"```(?:json)?\s*(\{.*?\}|\[.*?\])\s*```", text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(1))
        except Exception:
            pass
    # Find first { ... last }
    first = text.find("{")
    last = text.rfind("}")
    if first != -1 and last != -1 and last > first:
        try:
            return json.loads(text[first : last + 1])
        except Exception:
            pass
    # Array
    first = text.find("[")
    last = text.rfind("]")
    if first != -1 and last != -1 and last > first:
        try:
            return json.loads(text[first : last + 1])
        except Exception:
            pass
    return {}


# ========= Models =========
class ResumeEnhanceRequest(BaseModel):
    resume_text: str
    career_break_duration: str = ""
    break_reason: str = ""
    target_role: Optional[str] = ""


class ResumeEnhanceResponse(BaseModel):
    enhanced_resume: str
    improvements: List[str]
    career_break_reframed: str
    confidence_note: str


class SkillGapRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    years_experience: Optional[str] = ""


class SkillItem(BaseModel):
    name: str
    priority: str  # high | medium | low
    why: str
    resource: str


class SkillGapResponse(BaseModel):
    missing_skills: List[SkillItem]
    matched_skills: List[str]
    learning_path: List[str]
    estimated_weeks: int


class InterviewQuestionsRequest(BaseModel):
    target_role: str
    include_break_question: bool = True


class InterviewQuestion(BaseModel):
    id: str
    question: str
    category: str
    why_asked: str


class InterviewQuestionsResponse(BaseModel):
    questions: List[InterviewQuestion]


class InterviewFeedbackRequest(BaseModel):
    question: str
    answer: str
    target_role: Optional[str] = ""


class InterviewFeedbackResponse(BaseModel):
    score: int
    strengths: List[str]
    improvements: List[str]
    improved_answer: str
    confidence_tip: str


class StoryGenRequest(BaseModel):
    experiences: str  # what user did during break
    career_break_duration: str = ""


class StoryGenResponse(BaseModel):
    transferable_skills: List[str]
    resume_statements: List[str]
    elevator_pitch: str


class ChatMessageRequest(BaseModel):
    session_id: str
    message: str


class ChatMessageResponse(BaseModel):
    session_id: str
    reply: str


class ChatHistoryItem(BaseModel):
    role: str
    content: str
    timestamp: str


# ========= Routes =========
@api_router.get("/")
async def root():
    return {"message": "ReLaunch AI API is running", "status": "ok"}


@api_router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Parse PDF or DOCX resume and return text."""
    filename = (file.filename or "").lower()
    content = await file.read()
    text = ""
    try:
        if filename.endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = "\n".join((p.extract_text() or "") for p in reader.pages)
        elif filename.endswith(".docx"):
            doc = Document(io.BytesIO(content))
            text = "\n".join(p.text for p in doc.paragraphs)
        elif filename.endswith(".txt"):
            text = content.decode("utf-8", errors="ignore")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT.")
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Resume parsing failed")
        raise HTTPException(status_code=400, detail=f"Could not read file: {e}")

    return {"text": text.strip(), "filename": file.filename, "chars": len(text)}


@api_router.post("/resume/enhance", response_model=ResumeEnhanceResponse)
async def enhance_resume(req: ResumeEnhanceRequest):
    system = (
        "You are ReLaunch AI, a warm, expert career coach and resume writer helping women return to the "
        "workforce after a career break. Rewrite resumes to be modern, ATS-friendly, confident, and human. "
        "Reframe career breaks as periods of growth. Always respond with valid JSON only."
    )
    prompt = f"""
A user is returning to work after a career break. Enhance their resume.

CAREER BREAK DURATION: {req.career_break_duration or 'not specified'}
BREAK REASON: {req.break_reason or 'not specified'}
TARGET ROLE: {req.target_role or 'not specified'}

RESUME:
{req.resume_text}

Return ONLY a JSON object with keys:
- "enhanced_resume": a full rewritten resume as a single string. Use clear sections (Summary, Experience, Education, Skills). Preserve facts. Strengthen verbs. Quantify where reasonable.
- "improvements": array of 4-7 short bullet points describing key improvements you made
- "career_break_reframed": 2-3 sentence confident, honest paragraph explaining the career break as growth — transferable skills gained, readiness to return. No apologies.
- "confidence_note": one short warm encouraging sentence to the user
"""
    chat = new_chat(session_id=f"enhance-{uuid.uuid4()}", system_message=system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = extract_json(resp)
    if not data:
        raise HTTPException(status_code=500, detail="AI response could not be parsed")
    return ResumeEnhanceResponse(
        enhanced_resume=data.get("enhanced_resume", ""),
        improvements=data.get("improvements", []) or [],
        career_break_reframed=data.get("career_break_reframed", ""),
        confidence_note=data.get("confidence_note", "You've got this!"),
    )


@api_router.post("/skills/analyze", response_model=SkillGapResponse)
async def analyze_skills(req: SkillGapRequest):
    system = (
        "You are ReLaunch AI, an expert career coach. Analyze skill gaps between a user's current skills and "
        "a target role. Be practical and current (2026). Always respond with valid JSON only."
    )
    prompt = f"""
TARGET ROLE: {req.target_role}
CURRENT SKILLS: {", ".join(req.current_skills) if req.current_skills else "none listed"}
YEARS OF EXPERIENCE: {req.years_experience or 'unspecified'}

Return ONLY a JSON object with keys:
- "missing_skills": array of 5-8 objects, each with "name" (skill), "priority" ("high"|"medium"|"low"), "why" (1 sentence), "resource" (a well-known course/book/platform suggestion)
- "matched_skills": array of skill strings the user already has that matter for this role
- "learning_path": ordered array of 4-6 short steps (string) to close the gap
- "estimated_weeks": integer estimated weeks of focused study to be interview-ready
"""
    chat = new_chat(session_id=f"skills-{uuid.uuid4()}", system_message=system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = extract_json(resp)
    if not data:
        raise HTTPException(status_code=500, detail="AI response could not be parsed")
    missing = []
    for s in (data.get("missing_skills") or []):
        if isinstance(s, dict) and s.get("name"):
            missing.append(SkillItem(
                name=s.get("name", ""),
                priority=(s.get("priority") or "medium").lower(),
                why=s.get("why", ""),
                resource=s.get("resource", ""),
            ))
    return SkillGapResponse(
        missing_skills=missing,
        matched_skills=data.get("matched_skills", []) or [],
        learning_path=data.get("learning_path", []) or [],
        estimated_weeks=int(data.get("estimated_weeks") or 8),
    )


@api_router.post("/interview/questions", response_model=InterviewQuestionsResponse)
async def interview_questions(req: InterviewQuestionsRequest):
    system = (
        "You are ReLaunch AI, a supportive interview coach for women returning to work. "
        "Generate high-quality, realistic interview questions. Always respond with valid JSON only."
    )
    prompt = f"""
TARGET ROLE: {req.target_role}
INCLUDE CAREER BREAK QUESTION: {req.include_break_question}

Generate 6 realistic interview questions. Mix categories: behavioural, technical/role-specific, and situational.
{"ALWAYS include one that asks about the career break (gently, professionally)." if req.include_break_question else ""}

Return ONLY a JSON object with key "questions" = array of 6 objects:
- "question": the question text
- "category": "behavioural" | "technical" | "situational" | "career-break"
- "why_asked": 1 sentence explaining why interviewers ask this
"""
    chat = new_chat(session_id=f"iq-{uuid.uuid4()}", system_message=system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = extract_json(resp)
    qs = []
    for q in (data.get("questions") or []):
        if isinstance(q, dict) and q.get("question"):
            qs.append(InterviewQuestion(
                id=str(uuid.uuid4()),
                question=q.get("question", ""),
                category=q.get("category", "behavioural"),
                why_asked=q.get("why_asked", ""),
            ))
    if not qs:
        raise HTTPException(status_code=500, detail="AI response could not be parsed")
    return InterviewQuestionsResponse(questions=qs)


@api_router.post("/interview/feedback", response_model=InterviewFeedbackResponse)
async def interview_feedback(req: InterviewFeedbackRequest):
    system = (
        "You are ReLaunch AI, a kind and rigorous interview coach. Give honest, specific, encouraging "
        "feedback on interview answers. Always respond with valid JSON only."
    )
    prompt = f"""
TARGET ROLE: {req.target_role or 'general'}
QUESTION: {req.question}

CANDIDATE'S ANSWER:
{req.answer}

Return ONLY a JSON object with keys:
- "score": integer 1-10 (honest, calibrated)
- "strengths": array of 2-3 short strings noting what worked
- "improvements": array of 2-4 short actionable suggestions
- "improved_answer": a rewritten, stronger version of the candidate's answer (STAR method where applicable, 120-180 words)
- "confidence_tip": one warm practical tip to feel more confident delivering this answer
"""
    chat = new_chat(session_id=f"fb-{uuid.uuid4()}", system_message=system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = extract_json(resp)
    if not data:
        raise HTTPException(status_code=500, detail="AI response could not be parsed")
    return InterviewFeedbackResponse(
        score=int(data.get("score") or 6),
        strengths=data.get("strengths", []) or [],
        improvements=data.get("improvements", []) or [],
        improved_answer=data.get("improved_answer", ""),
        confidence_tip=data.get("confidence_tip", "Take a breath. You've earned this seat."),
    )


@api_router.post("/story/generate", response_model=StoryGenResponse)
async def generate_story(req: StoryGenRequest):
    system = (
        "You are ReLaunch AI, a career storytelling expert. Translate personal life experiences during a "
        "career break into professional, transferable skills and strong resume statements. Always respond "
        "with valid JSON only. Be honest but confident — never apologetic."
    )
    prompt = f"""
CAREER BREAK DURATION: {req.career_break_duration or 'unspecified'}

EXPERIENCES / ACTIVITIES DURING BREAK:
{req.experiences}

Return ONLY a JSON object with keys:
- "transferable_skills": array of 5-8 short skill labels (e.g., "Project Management", "Stakeholder Communication")
- "resume_statements": array of 3-5 strong, quantified-where-possible resume bullet points that reframe these experiences professionally
- "elevator_pitch": a warm, confident 3-4 sentence elevator pitch the user can say in an interview when asked about their break
"""
    chat = new_chat(session_id=f"story-{uuid.uuid4()}", system_message=system)
    resp = await chat.send_message(UserMessage(text=prompt))
    data = extract_json(resp)
    if not data:
        raise HTTPException(status_code=500, detail="AI response could not be parsed")
    return StoryGenResponse(
        transferable_skills=data.get("transferable_skills", []) or [],
        resume_statements=data.get("resume_statements", []) or [],
        elevator_pitch=data.get("elevator_pitch", ""),
    )


@api_router.post("/chat", response_model=ChatMessageResponse)
async def chat_message(req: ChatMessageRequest):
    system = (
        "You are ReLaunch AI — a warm, empathetic, and wise AI career coach for women returning to the "
        "workforce after a career break. You balance emotional support with practical, specific career advice. "
        "Keep responses concise (2-5 short paragraphs), honest, encouraging, never condescending. "
        "If the user is anxious, validate feelings first, then offer one concrete next step. "
        "Never start replies with apologies or 'As an AI'."
    )

    # Persist user message
    now = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one({
        "session_id": req.session_id,
        "role": "user",
        "content": req.message,
        "timestamp": now,
    })

    # Load prior history to seed continuity (emergentintegrations handles session continuity via session_id,
    # but we persist separately for UI)
    chat = new_chat(session_id=req.session_id, system_message=system)
    resp = await chat.send_message(UserMessage(text=req.message))

    reply_ts = datetime.now(timezone.utc).isoformat()
    await db.chat_messages.insert_one({
        "session_id": req.session_id,
        "role": "assistant",
        "content": resp,
        "timestamp": reply_ts,
    })
    return ChatMessageResponse(session_id=req.session_id, reply=resp)


@api_router.get("/chat/history/{session_id}", response_model=List[ChatHistoryItem])
async def chat_history(session_id: str):
    items = await db.chat_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("timestamp", 1).to_list(1000)
    return [ChatHistoryItem(**i) for i in items]


# Progress tracking (simple per-session)
class ProgressUpdate(BaseModel):
    session_id: str
    step: str  # resume | skills | interview | story
    done: bool = True


@api_router.post("/progress/update")
async def update_progress(req: ProgressUpdate):
    await db.progress.update_one(
        {"session_id": req.session_id},
        {"$set": {f"steps.{req.step}": req.done, "updated_at": datetime.now(timezone.utc).isoformat()}},
        upsert=True,
    )
    doc = await db.progress.find_one({"session_id": req.session_id}, {"_id": 0})
    return doc or {"session_id": req.session_id, "steps": {}}


@api_router.get("/progress/{session_id}")
async def get_progress(session_id: str):
    doc = await db.progress.find_one({"session_id": session_id}, {"_id": 0})
    return doc or {"session_id": session_id, "steps": {}}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
