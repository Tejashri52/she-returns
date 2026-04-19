# ReLaunch AI 💜

> **Restart Your Career with Confidence** — an AI-powered career comeback assistant for women returning to the workforce after a career break.

ReLaunch AI transforms resumes, closes skill gaps, rehearses interviews, and reframes career breaks as growth — not apology. Built with warmth, powered by GPT-5.2.

![Stack](https://img.shields.io/badge/stack-React%20%7C%20FastAPI%20%7C%20MongoDB-7C6CF6) ![AI](https://img.shields.io/badge/AI-GPT--5.2-4FD1C5) ![License](https://img.shields.io/badge/license-MIT-FFB7A5)

---

## ✨ Features

| Feature | What it does |
| --- | --- |
| 📄 **Resume Enhancer** | PDF/DOCX/TXT upload or paste → AI-rewritten resume with a dedicated "Career Break Reframed" section |
| 🎯 **Skill Gap Analyzer** | Target role + current skills → prioritized missing skills, matched skills, ordered learning path, time estimate |
| 🎤 **Interview Coach** | Generates real interview questions (incl. the career-break one) → scored, warm feedback + a stronger version of your answer |
| 🪄 **Career Break Story Generator** | Translates life experiences during the break into transferable skills, resume bullets, and an elevator pitch |
| 💬 **AI Chat Coach** | Always-on, empathetic career coach (full page + floating widget). Persistent chat history. |
| 📊 **Dashboard** | Welcome + progress tracker + quick actions. "Start fresh" resets progress & chat. |

---

## 🏗 Tech Stack

- **Frontend**: React 19, React Router, Tailwind CSS, Shadcn UI, Framer Motion, react-dropzone, Sonner
- **Backend**: FastAPI, Motor (async MongoDB), Pydantic v2, PyPDF2, python-docx
- **AI**: [emergentintegrations](https://emergent.sh) → OpenAI GPT-5.2
- **Fonts**: Outfit (headings) + DM Sans (body)
- **Palette**: Soft Purple `#7C6CF6` · Warm Peach `#FFB7A5` · Accent Teal `#4FD1C5`

---

## 📁 Project Structure

```
app/
├── backend/
│   ├── server.py            # FastAPI app, all /api routes
│   ├── requirements.txt
│   └── .env                 # MONGO_URL, DB_NAME, EMERGENT_LLM_KEY
├── frontend/
│   ├── src/
│   │   ├── App.js           # Router
│   │   ├── lib/api.js       # axios + session id helper
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── FloatingChat.jsx
│   │   │   └── ui/          # Shadcn primitives
│   │   └── pages/
│   │       ├── Landing.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Resume.jsx
│   │       ├── Skills.jsx
│   │       ├── Interview.jsx
│   │       ├── Story.jsx
│   │       └── Chat.jsx
│   ├── package.json
│   └── .env                 # REACT_APP_BACKEND_URL
└── memory/
    └── PRD.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, Yarn 1.22+
- Python 3.10+
- MongoDB (local or Atlas)
- An Emergent Universal LLM key (or OpenAI key)

### 1. Backend

```bash
cd backend
pip install -r requirements.txt

# Create .env
cat > .env <<EOF
MONGO_URL="mongodb://localhost:27017"
DB_NAME="relaunch_ai"
CORS_ORIGINS="*"
EMERGENT_LLM_KEY="sk-emergent-..."
EOF

# Run
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### 2. Frontend

```bash
cd frontend
yarn install

# Create .env
cat > .env <<EOF
REACT_APP_BACKEND_URL=http://localhost:8001
EOF

# Run
yarn start
```

Open http://localhost:3000 💜

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`    | `/` | Health check |
| `POST`   | `/resume/upload` | Parse PDF/DOCX/TXT → text |
| `POST`   | `/resume/enhance` | Rewrite resume + reframe career break |
| `POST`   | `/skills/analyze` | Missing skills + learning path |
| `POST`   | `/interview/questions` | 6 role-specific interview questions |
| `POST`   | `/interview/feedback` | Score + improved answer + confidence tip |
| `POST`   | `/story/generate` | Transferable skills + resume bullets + elevator pitch |
| `POST`   | `/chat` | Send message to AI coach (persisted) |
| `GET`    | `/chat/history/{session_id}` | Fetch chat history |
| `DELETE` | `/chat/history/{session_id}` | Clear chat history |
| `POST`   | `/progress/update` | Mark a step complete |
| `GET`    | `/progress/{session_id}` | Get progress |
| `DELETE` | `/progress/{session_id}` | Reset progress + chat (dashboard "Start fresh") |

### Example: Enhance a resume

```bash
curl -X POST http://localhost:8001/api/resume/enhance \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Priya Sharma · Product Manager · 8 yrs experience...",
    "career_break_duration": "3 years",
    "break_reason": "maternity leave",
    "target_role": "Senior Product Manager"
  }'
```

Response:
```json
{
  "enhanced_resume": "...",
  "improvements": ["Stronger action verbs", "Quantified impact", "..."],
  "career_break_reframed": "I took a three-year intentional break to...",
  "confidence_note": "You're bringing more than you realize."
}
```

---

## 🧪 Testing

```bash
# Backend (pytest suite lives in backend/tests/)
cd backend && pytest tests/ -v

# Frontend lint
cd frontend && npx eslint src/
```

---

## 🎨 Design Language

- **Minimal, warm, human-centered** — the opposite of a cold resume-builder
- Rounded `2xl` / `3xl` corners, soft shadows, generous whitespace
- Empathetic microcopy everywhere: *"You're doing great"*, *"Translating your life to leadership…"*
- Fonts: **Outfit** (confident headings) + **DM Sans** (calm body)
- Motion via Framer Motion — fade-up entrances, pulsing "thinking" states

---

## 🗺 Roadmap

- [ ] Export enhanced resume to PDF/DOCX
- [ ] Save multiple resume versions (requires optional login)
- [ ] Voice interview coach (ElevenLabs TTS + Whisper STT)
- [ ] LinkedIn profile optimizer page
- [ ] "Share my comeback story" social card generator
- [ ] Scheduled weekly nudges via email
- [ ] Multi-language support (Hindi, Spanish, Arabic)
- [ ] Employer directory for returnship programs

---

## 🔒 Privacy

- No public training on your data
- Resume / story text is sent to the LLM only for the active request
- Session ID lives in your browser's `localStorage` — clear it any time
- MongoDB stores only chat history + progress tracker (scoped to session id)

---

## 🤝 Contributing

Issues and PRs welcome. Please keep the tone of the product in mind: this is for real women doing a brave thing. Warmth is a feature.

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/amazing-thing`
3. Commit: `git commit -m "feat: add amazing thing"`
4. Push: `git push origin feat/amazing-thing`
5. Open a PR

---

## 📄 License

MIT © ReLaunch AI contributors

---

## 💌 A note

> *Your career didn't pause. It evolved.*

If ReLaunch AI helped you — tell a friend. Every woman deserves a coach in her corner.

Built with 💜 for every woman restarting her story.
