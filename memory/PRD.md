# ReLaunch AI — Product Requirements Document

## Original Problem Statement
Build "ReLaunch AI" — an AI-powered career comeback assistant for women returning to the workforce after a career break. Multi-page web app that helps users transform resumes, identify skill gaps, prepare for interviews, and reframe career breaks as growth.

## User Choices (locked in)
- LLM: **GPT-5.2** via Emergent Universal LLM Key (`EMERGENT_LLM_KEY`)
- Auth: None (open access for MVP)
- Resume input: PDF / DOCX / TXT upload + text paste
- Scope: All 6 pages end-to-end
- UI: Must feel **human-centered**, warm, empowering — hackathon deliverable

## Primary Persona
Women returning to work after a career break (maternity leave, caregiving, health, education). Career-aware, resume-anxious, confidence-bruised, tech-comfortable but not technical.

## Architecture
- **Frontend**: React 19 + React Router + Tailwind + Shadcn UI + Framer Motion + react-dropzone. Fonts: Outfit (headings) + DM Sans (body).
- **Backend**: FastAPI, all routes prefixed `/api`, MongoDB via Motor.
- **AI**: `emergentintegrations.LlmChat` → OpenAI GPT-5.2 with `with_retry` wrapper.

## Pages Implemented (Feb 2026)
| Page | Route | Backend endpoint |
| --- | --- | --- |
| Landing | `/` | — |
| Dashboard | `/dashboard` | `/api/progress/{id}` |
| Resume Enhancement | `/resume` | `/api/resume/upload`, `/api/resume/enhance` |
| Skill Gap Analyzer | `/skills` | `/api/skills/analyze` |
| Interview Coach | `/interview` | `/api/interview/questions`, `/api/interview/feedback` |
| Career Break Story Generator | `/story` | `/api/story/generate` |
| AI Chat Assistant (full page + floating widget) | `/chat` | `/api/chat`, `/api/chat/history/{id}` |

## Implemented Features (Feb 2026)
- Warm multi-page UX with progress tracker, sticky glass nav, floating AI chat
- Resume rewriter with "Career Break Reframed" section + copy-to-clipboard
- PDF/DOCX/TXT parsing (PyPDF2 + python-docx)
- Skills analyzer: prioritized missing skills, matched skills, ordered learning path, ETA weeks
- Interview coach: AI-generated questions (incl. career-break) + scored feedback + improved answer
- Career Break Story Generator: transferable skills, resume bullets, elevator pitch
- Persistent chat history in MongoDB with session id in localStorage
- Progress tracker auto-updates when a feature is used
- Retry wrapper on all LLM calls to smooth over transient proxy hiccups

## Testing Status
- Backend: 11/11 pytest cases pass (see `/app/backend/tests/test_relaunch_api.py`)
- Frontend: landing + all routes navigate; Skills, Chat, Story happy paths verified end-to-end.

## P1 Backlog (post-MVP)
- Export enhanced resume to PDF/DOCX
- Save multiple resume versions per user
- Optional login (Emergent Google Auth) to persist progress across devices
- Voice interview coach (ElevenLabs TTS + OpenAI Whisper)
- Community: anonymized success stories feed
- LinkedIn profile optimization page
- Scheduled weekly nudges via Resend email

## P2 Backlog
- Team-up "comeback buddy" pairing
- Employer partner directory (returnship programs)
- Multi-language support (Hindi, Spanish, Arabic)
