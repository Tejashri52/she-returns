import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, getSessionId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Sparkles, CheckCircle2, ArrowRight, X, Plus, BookOpen, Flame } from "lucide-react";

const PRIORITY_STYLES = {
  high: "bg-[#FFE3DB] text-[#B44B2E] border-[#FFB7A5]",
  medium: "bg-[#FFF4CF] text-[#9B6D00] border-[#FFE29A]",
  low: "bg-[#D9F5F1] text-[#0D8076] border-[#4FD1C5]",
};

const LOADING_LINES = [
  "Mapping your skills to your dream role…",
  "Calibrating a learning path that actually fits your life…",
  "Highlighting the skills you already bring to the table…",
];

export default function Skills() {
  const [targetRole, setTargetRole] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [years, setYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  };

  const analyze = async () => {
    if (!targetRole.trim()) {
      toast.error("Tell us your target role first");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const r = await api.post("/skills/analyze", {
        target_role: targetRole,
        current_skills: skills,
        years_experience: years,
      });
      setResult(r.data);
      await api.post("/progress/update", { session_id: getSessionId(), step: "skills", done: true }).catch(() => {});
      toast.success("Your personalized path is ready");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not analyze");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12" data-testid="skills-page">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#4FD1C5]">Skill gap analyzer</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-3 text-[#1A1A24]">
        Close the gap. <span className="text-[#4FD1C5]">Own the role.</span>
      </h1>
      <p className="text-gray-600 mt-3 max-w-2xl">
        Tell us where you're headed and what you bring. We'll show you exactly what to learn next — prioritized so you don't waste a single hour.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft">
          <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target role</Label>
          <Input
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Product Manager, Data Analyst"
            className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#4FD1C5]"
            data-testid="skills-role-input"
          />

          <div className="mt-5">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Years of experience (total)</Label>
            <Input
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="e.g. 6 years"
              className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#4FD1C5]"
              data-testid="skills-years-input"
            />
          </div>

          <div className="mt-5">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your current skills</Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                placeholder="Type a skill and press Enter"
                className="rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#4FD1C5]"
                data-testid="skill-add-input"
              />
              <Button onClick={addSkill} className="rounded-full bg-[#4FD1C5] hover:bg-[#3BAFA3] text-white" data-testid="skill-add-btn">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" data-testid="skills-list">
              {skills.length === 0 && <span className="text-sm text-gray-400">No skills added yet — that's okay.</span>}
              {skills.map((s) => (
                <Badge key={s} variant="outline" className="rounded-full bg-[#ECE9FE] text-[#5A4BD4] border-[#D9D2FB] px-3 py-1">
                  {s}
                  <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Button
            onClick={analyze}
            disabled={loading}
            className="w-full mt-6 rounded-full bg-[#1A1A24] hover:bg-black text-white py-6 text-base"
            data-testid="analyze-skills-btn"
          >
            {loading ? <span className="inline-flex items-center gap-2"><Target className="w-4 h-4 animate-pulse" /> Analyzing<span className="thinking-dots" /></span> : <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Analyze my skills</span>}
          </Button>
        </div>

        <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft min-h-[520px] relative">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center gap-3 p-8" data-testid="skills-loader">
                <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#4FD1C5] to-[#7C6CF6] flex items-center justify-center animate-pulse">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="font-heading font-semibold text-lg">Thinking through your path…</div>
                <div className="text-sm text-gray-500">{LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]}</div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center p-10" data-testid="skills-empty">
                <div className="w-14 h-14 rounded-3xl bg-[#D9F5F1] flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#4FD1C5]" />
                </div>
                <div className="font-heading font-semibold text-xl mt-4">Your learning path will appear here</div>
                <div className="text-sm text-gray-500 mt-2 max-w-sm">Prioritized skills + real-world resources.</div>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div key="r" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} data-testid="skills-result">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Estimated time to ready</div>
                    <div className="font-heading font-bold text-3xl text-[#7C6CF6] mt-1" data-testid="weeks-estimate">~ {result.estimated_weeks} weeks</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#0D8076] bg-[#D9F5F1] rounded-full px-3 py-1"><Flame className="w-4 h-4" /> You've got this</div>
                </div>
                <Progress value={Math.min(100, (result.matched_skills?.length || 0) * 12)} className="mt-4 h-2 bg-[#F3F0FF]" />

                {result.matched_skills?.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">You already bring</div>
                    <div className="flex flex-wrap gap-2 mt-2" data-testid="matched-skills">
                      {result.matched_skills.map((s) => (
                        <Badge key={s} className="bg-[#D9F5F1] text-[#0D8076] border-[#4FD1C5]/30 rounded-full px-3 py-1">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.missing_skills?.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Skills to add</div>
                    <div className="mt-3 space-y-3" data-testid="missing-skills">
                      {result.missing_skills.map((s, i) => (
                        <div key={i} className={`rounded-2xl border p-4 ${PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.medium}`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="font-semibold text-[#1A1A24]">{s.name}</div>
                              <div className="text-sm mt-1 opacity-80">{s.why}</div>
                              {s.resource && (
                                <div className="text-xs mt-2 inline-flex items-center gap-1 opacity-80">
                                  <BookOpen className="w-3 h-3" /> {s.resource}
                                </div>
                              )}
                            </div>
                            <Badge variant="outline" className="uppercase text-[10px] border-transparent bg-white/70 shrink-0">
                              {s.priority}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.learning_path?.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Your learning path</div>
                    <ol className="mt-3 space-y-2" data-testid="learning-path">
                      {result.learning_path.map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                          <div className="w-6 h-6 rounded-full bg-[#ECE9FE] text-[#5A4BD4] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                          {step}
                        </li>
                      ))}
                    </ol>
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
