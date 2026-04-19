import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, getSessionId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Mic2, Sparkles, ArrowLeft, ArrowRight, Heart, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react";

const CAT_STYLE = {
  "behavioural": "bg-[#ECE9FE] text-[#5A4BD4]",
  "technical": "bg-[#D9F5F1] text-[#0D8076]",
  "situational": "bg-[#FFF4CF] text-[#9B6D00]",
  "career-break": "bg-[#FFE3DB] text-[#B44B2E]",
};

export default function Interview() {
  const [targetRole, setTargetRole] = useState("");
  const [loadingQs, setLoadingQs] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [loadingFb, setLoadingFb] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const generate = async () => {
    if (!targetRole.trim()) {
      toast.error("Pick a target role to get questions");
      return;
    }
    setLoadingQs(true);
    setQuestions([]);
    setFeedback(null);
    try {
      const r = await api.post("/interview/questions", {
        target_role: targetRole,
        include_break_question: true,
      });
      setQuestions(r.data.questions || []);
      setIdx(0);
      setAnswer("");
      toast.success("Your questions are ready");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not generate questions");
    } finally {
      setLoadingQs(false);
    }
  };

  const getFeedback = async () => {
    if (!answer.trim()) {
      toast.error("Type an answer first");
      return;
    }
    setLoadingFb(true);
    setFeedback(null);
    try {
      const q = questions[idx];
      const r = await api.post("/interview/feedback", {
        question: q.question,
        answer,
        target_role: targetRole,
      });
      setFeedback(r.data);
      await api.post("/progress/update", { session_id: getSessionId(), step: "interview", done: true }).catch(() => {});
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not get feedback");
    } finally {
      setLoadingFb(false);
    }
  };

  const next = () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setAnswer("");
      setFeedback(null);
    }
  };
  const prev = () => {
    if (idx > 0) {
      setIdx(idx - 1);
      setAnswer("");
      setFeedback(null);
    }
  };

  const q = questions[idx];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12" data-testid="interview-page">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB7A5]">Interview coach</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-3 text-[#1A1A24]">
        Rehearse the <span className="text-[#FFB7A5]">brave conversation</span>.
      </h1>
      <p className="text-gray-600 mt-3 max-w-2xl">
        Real questions for your target role — including the career break one. Answer, and get warm, specific feedback plus a stronger version of your answer.
      </p>

      {/* Setup */}
      {questions.length === 0 && (
        <div className="mt-10 rounded-3xl bg-white border border-gray-100 p-7 shadow-soft max-w-xl">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target role</Label>
          <Input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Product Manager"
            className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#FFB7A5]"
            data-testid="interview-role-input"
          />
          <Button
            onClick={generate}
            disabled={loadingQs}
            className="w-full mt-5 rounded-full bg-[#1A1A24] hover:bg-black text-white py-6"
            data-testid="generate-questions-btn"
          >
            {loadingQs ? <span className="inline-flex items-center gap-2"><Mic2 className="w-4 h-4 animate-pulse" /> Generating<span className="thinking-dots" /></span> : <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate my questions</span>}
          </Button>
        </div>
      )}

      {/* Question flow */}
      {questions.length > 0 && q && (
        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {/* Question card */}
          <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <Badge className={`rounded-full px-3 py-1 uppercase text-[10px] ${CAT_STYLE[q.category] || "bg-gray-100"}`}>{q.category}</Badge>
              <div className="text-xs text-gray-500" data-testid="question-progress">Question {idx + 1} / {questions.length}</div>
            </div>
            <h2 className="font-heading font-bold text-2xl mt-4 text-[#1A1A24] leading-snug" data-testid="current-question">{q.question}</h2>
            {q.why_asked && (
              <div className="mt-4 rounded-2xl bg-[#FFF4CF] text-[#9B6D00] p-4 text-sm flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5" />
                <div><span className="font-semibold">Why they ask this:</span> {q.why_asked}</div>
              </div>
            )}

            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-6 block">Your answer</Label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Take your time. Be honest. Be proud."
              className="min-h-[200px] mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#FFB7A5]"
              data-testid="answer-textarea"
            />

            <div className="mt-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={prev} disabled={idx === 0} className="rounded-full" data-testid="prev-question-btn">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={next} disabled={idx === questions.length - 1} className="rounded-full" data-testid="next-question-btn">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={getFeedback}
                disabled={loadingFb}
                className="rounded-full bg-[#FFB7A5] hover:bg-[#FF9E86] text-[#1A1A24] font-semibold px-6"
                data-testid="get-feedback-btn"
              >
                {loadingFb ? <span className="inline-flex items-center gap-2">Analyzing<span className="thinking-dots" /></span> : <>Get feedback <Sparkles className="w-4 h-4 ml-1" /></>}
              </Button>
            </div>
          </div>

          {/* Feedback */}
          <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft min-h-[500px] relative">
            <AnimatePresence mode="wait">
              {loadingFb && (
                <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center gap-3 p-8" data-testid="feedback-loader">
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#FFB7A5] to-[#7C6CF6] flex items-center justify-center animate-pulse">
                    <Mic2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-heading font-semibold text-lg">Listening carefully…</div>
                </motion.div>
              )}

              {!loadingFb && !feedback && (
                <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8" data-testid="feedback-empty">
                  <div className="w-14 h-14 rounded-3xl bg-[#FFE3DB] flex items-center justify-center">
                    <Heart className="w-6 h-6 text-[#B44B2E]" />
                  </div>
                  <div className="font-heading font-semibold text-xl mt-4">Feedback will appear here</div>
                  <div className="text-sm text-gray-500 mt-2 max-w-sm">Strengths, improvements, and a polished version of your answer.</div>
                </motion.div>
              )}

              {!loadingFb && feedback && (
                <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} data-testid="feedback-result">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] flex items-center justify-center text-white font-heading font-bold text-xl" data-testid="feedback-score">{feedback.score}/10</div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Your score</div>
                      <div className="text-sm text-gray-600">Honest & calibrated — you're closer than you think.</div>
                    </div>
                  </div>

                  {feedback.strengths?.length > 0 && (
                    <div className="mt-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">What worked</div>
                      <ul className="mt-2 space-y-1.5">
                        {feedback.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#4FD1C5] mt-0.5" /> {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.improvements?.length > 0 && (
                    <div className="mt-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Tighten this</div>
                      <ul className="mt-2 space-y-1.5">
                        {feedback.improvements.map((s, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2"><TrendingUp className="w-4 h-4 text-[#7C6CF6] mt-0.5" /> {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.improved_answer && (
                    <div className="mt-5 rounded-2xl bg-gradient-to-br from-[#ECE9FE] to-[#FFE3DB] p-5 border border-white">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A4BD4]">Stronger answer</div>
                      <p className="mt-3 text-[#1A1A24] leading-relaxed text-sm" data-testid="improved-answer">{feedback.improved_answer}</p>
                    </div>
                  )}

                  {feedback.confidence_tip && (
                    <div className="mt-5 text-sm italic text-[#5A4BD4] flex items-start gap-2">
                      <Heart className="w-4 h-4 text-[#FFB7A5] mt-0.5" fill="#FFB7A5" /> {feedback.confidence_tip}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
