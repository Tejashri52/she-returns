import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api, getSessionId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, FileText, Sparkles, CheckCircle2, Copy, Wand2, Heart } from "lucide-react";

const LOADING_LINES = [
  "Reading between the lines of your amazing experience…",
  "Translating your life skills into professional superpowers…",
  "Polishing your words with warmth and precision…",
  "Reframing your break as the growth chapter it really was…",
];

export default function Resume() {
  const [resumeText, setResumeText] = useState("");
  const [breakDuration, setBreakDuration] = useState("");
  const [breakReason, setBreakReason] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [loadingLine, setLoadingLine] = useState(LOADING_LINES[0]);

  const onDrop = useCallback(async (files) => {
    const f = files?.[0];
    if (!f) return;
    const form = new FormData();
    form.append("file", f);
    try {
      const r = await api.post("/resume/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResumeText(r.data.text || "");
      setFilename(r.data.filename || "");
      toast.success("Resume loaded — looking good!");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Could not read file");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
  });

  const submit = async () => {
    if (!resumeText.trim()) {
      toast.error("Paste or upload your resume first");
      return;
    }
    setLoading(true);
    setResult(null);
    const iv = setInterval(() => {
      setLoadingLine(LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]);
    }, 2200);
    try {
      const r = await api.post("/resume/enhance", {
        resume_text: resumeText,
        career_break_duration: breakDuration,
        break_reason: breakReason,
        target_role: targetRole,
      });
      setResult(r.data);
      await api.post("/progress/update", { session_id: getSessionId(), step: "resume", done: true }).catch(() => {});
      toast.success("Your resume glow-up is ready ✨");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Something went wrong");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12" data-testid="resume-page">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6CF6]">Resume enhancer</div>
      <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-3 text-[#1A1A24]">
        Let's make your resume <span className="text-[#7C6CF6]">shine</span>.
      </h1>
      <p className="text-gray-600 mt-3 max-w-2xl">
        Upload your current resume or paste it in. We'll rewrite it with clarity, confidence, and a section that
        reframes your career break as growth — because that's exactly what it was.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mt-10">
        {/* INPUT */}
        <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft">
          <div {...getRootProps()} className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${isDragActive ? "border-[#7C6CF6] bg-[#F3F0FF]" : "border-gray-200 hover:border-[#7C6CF6] hover:bg-[#F9FAFB]"}`} data-testid="resume-dropzone">
            <input {...getInputProps()} data-testid="resume-file-input" />
            <UploadCloud className="w-10 h-10 text-[#7C6CF6] mx-auto" />
            <div className="mt-3 font-semibold text-[#1A1A24]">Drop your resume here</div>
            <div className="text-sm text-gray-500">PDF, DOCX or TXT · or paste the text below</div>
            {filename && (
              <div className="mt-3 inline-flex items-center gap-2 text-sm bg-[#D9F5F1] text-[#0D8076] rounded-full px-3 py-1">
                <FileText className="w-4 h-4" /> {filename}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your resume (text)</Label>
              <Textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume here… it's okay if it's messy, we'll polish it."
                className="min-h-[220px] mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6]"
                data-testid="resume-textarea"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Career break duration</Label>
                <Input
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(e.target.value)}
                  placeholder="e.g. 3 years"
                  className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6]"
                  data-testid="break-duration-input"
                />
              </div>
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Target role (optional)</Label>
                <Input
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Product Manager"
                  className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6]"
                  data-testid="target-role-input"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Break reason (optional)</Label>
              <Input
                value={breakReason}
                onChange={(e) => setBreakReason(e.target.value)}
                placeholder="e.g. maternity leave, caring for family, upskilling"
                className="mt-2 rounded-2xl bg-[#F9FAFB] border-gray-200 focus-visible:ring-[#7C6CF6]"
                data-testid="break-reason-input"
              />
            </div>

            <Button
              onClick={submit}
              disabled={loading}
              className="w-full rounded-full bg-[#1A1A24] hover:bg-black text-white py-6 text-base"
              data-testid="enhance-resume-btn"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2"><Wand2 className="w-4 h-4 animate-pulse" /> Working magic<span className="thinking-dots" /></span>
              ) : (
                <span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4" /> Enhance my resume</span>
              )}
            </Button>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft min-h-[600px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-10 text-center"
                data-testid="resume-loader"
              >
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5] flex items-center justify-center animate-pulse">
                  <Wand2 className="w-7 h-7 text-white" />
                </div>
                <div className="font-heading font-semibold text-xl text-[#1A1A24]">Give us a moment…</div>
                <div className="text-sm text-gray-600 max-w-sm">{loadingLine}</div>
              </motion.div>
            )}

            {!loading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-10"
                data-testid="resume-empty"
              >
                <div className="w-16 h-16 rounded-3xl bg-[#ECE9FE] flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-[#7C6CF6]" />
                </div>
                <div className="font-heading font-semibold text-xl mt-4 text-[#1A1A24]">Your enhanced resume will appear here</div>
                <div className="text-sm text-gray-500 mt-2 max-w-sm">Including a warm, confident reframing of your career break.</div>
              </motion.div>
            )}

            {!loading && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                data-testid="resume-result"
              >
                {/* Career Break Reframed */}
                <div className="rounded-2xl bg-gradient-to-br from-[#FFE3DB] to-[#ECE9FE] p-5 border border-white">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A4BD4] flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5" /> Career break, reframed
                  </div>
                  <p className="text-[#1A1A24] mt-3 leading-relaxed" data-testid="reframed-text">{result.career_break_reframed}</p>
                </div>

                {/* Improvements */}
                {result.improvements?.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">What changed</div>
                    <ul className="mt-3 space-y-2">
                      {result.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-[#4FD1C5] mt-0.5 shrink-0" /> {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Enhanced Resume */}
                <div className="mt-6 rounded-2xl bg-[#F9FAFB] border border-gray-100 p-5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Enhanced resume</div>
                    <Button variant="ghost" size="sm" onClick={() => copy(result.enhanced_resume)} data-testid="copy-resume-btn">
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                    </Button>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed" data-testid="enhanced-resume-text">{result.enhanced_resume}</pre>
                </div>

                {result.confidence_note && (
                  <div className="mt-5 text-sm italic text-[#5A4BD4] flex items-start gap-2">
                    <Heart className="w-4 h-4 text-[#FFB7A5] mt-0.5" fill="#FFB7A5" /> {result.confidence_note}
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
