import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, getSessionId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wand2, Sparkles, Copy, Heart } from "lucide-react";

export default function Story() {
  const [experiences, setExperiences] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generate = async () => {
    if (!experiences.trim()) {
      toast.error("Share a few words about your break first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await api.post("/story/generate", {
        experiences,
        career_break_duration: duration,
      });
      setResult(r.data);
      await api.post("/progress/update", { session_id: getSessionId(), step: "story", done: true }).catch(() => {});
      toast.success("Your story, reframed ✨");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not generate");
    } finally {
      setLoading(false);
    }
  };

  const copy = (t) => {
    navigator.clipboard.writeText(t);
    toast.success("Copied");
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12" data-testid="story-page">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6CF6]">Career break story generator</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-3 text-[#1A1A24]">
        Your break wasn't a <span className="text-[#7C6CF6] line-through decoration-[#FFB7A5]">gap</span>.{" "}
        <span className="block">It was a <span className="text-[#4FD1C5]">chapter</span>.</span>
      </h1>
      <p className="text-gray-600 mt-3 max-w-2xl">
        Tell us what you did — raised kids, cared for family, volunteered, learned, started something small. We'll translate it into professional, resume-ready strengths and an interview-ready pitch.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Break duration</Label>
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 3 years"
            className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6]"
            data-testid="story-duration-input"
          />

          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 mt-5 block">
            What did you do during your break?
          </Label>
          <Textarea
            value={experiences}
            onChange={(e) => setExperiences(e.target.value)}
            placeholder="Tell us honestly. Small things count too — juggling family logistics, learning a new skill online, volunteering, running a household, freelancing, healing. It's all transferable."
            className="min-h-[260px] mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6]"
            data-testid="story-experiences-input"
          />

          <Button
            onClick={generate}
            disabled={loading}
            className="w-full mt-5 rounded-full bg-[#1A1A24] hover:bg-black text-white py-6"
            data-testid="generate-story-btn"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Wand2 className="w-4 h-4 animate-pulse" /> Translating your life to leadership<span className="thinking-dots" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Reframe my story</span>
            )}
          </Button>

          <div className="text-xs text-gray-500 mt-4 italic flex items-start gap-1">
            <Heart className="w-3 h-3 text-[#FFB7A5] mt-0.5" fill="#FFB7A5" />
            Everything you type stays yours. No judgment, ever.
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft min-h-[500px] relative">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center gap-3 p-8" data-testid="story-loader">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#7C6CF6] to-[#4FD1C5] flex items-center justify-center animate-pulse">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div className="font-heading font-semibold text-lg">Finding the leader in your story…</div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-8" data-testid="story-empty">
                <div className="w-14 h-14 rounded-3xl bg-[#ECE9FE] flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-[#7C6CF6]" />
                </div>
                <div className="font-heading font-semibold text-xl mt-4">Your reframed story will appear here</div>
                <div className="text-sm text-gray-500 mt-2 max-w-sm">Transferable skills, resume bullets, and an elevator pitch.</div>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div key="r" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} data-testid="story-result">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Transferable skills</div>
                  <div className="flex flex-wrap gap-2 mt-2" data-testid="transferable-skills">
                    {result.transferable_skills?.map((s, i) => (
                      <Badge key={i} className="bg-[#ECE9FE] text-[#5A4BD4] rounded-full px-3 py-1 border-[#D9D2FB]">{s}</Badge>
                    ))}
                  </div>
                </div>

                {result.resume_statements?.length > 0 && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Resume-ready statements</div>
                      <Button variant="ghost" size="sm" onClick={() => copy(result.resume_statements.map(x => "• " + x).join("\n"))} data-testid="copy-statements-btn">
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy all
                      </Button>
                    </div>
                    <ul className="mt-2 space-y-2" data-testid="resume-statements">
                      {result.resume_statements.map((s, i) => (
                        <li key={i} className="rounded-2xl bg-[#F9FAFB] border border-gray-100 p-4 text-sm text-gray-800 leading-relaxed">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.elevator_pitch && (
                  <div className="mt-6 rounded-2xl bg-gradient-to-br from-[#FFE3DB] to-[#D9F5F1] p-5 border border-white">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D8076]">Your elevator pitch</div>
                      <Button variant="ghost" size="sm" onClick={() => copy(result.elevator_pitch)} data-testid="copy-pitch-btn">
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                      </Button>
                    </div>
                    <p className="mt-3 text-[#1A1A24] leading-relaxed" data-testid="elevator-pitch">{result.elevator_pitch}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
