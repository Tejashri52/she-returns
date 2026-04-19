import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api, getSessionId, getUserName, setUserName } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  FileText,
  Target,
  Mic2,
  Wand2,
  MessageCircleHeart,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Heart,
  RotateCcw,
} from "lucide-react";

const QUICK_ACTIONS = [
  { key: "resume", to: "/resume", title: "Enhance my Resume", desc: "Rewrite with confidence. Reframe the break.", icon: FileText, color: "from-[#7C6CF6] to-[#A08CFA]" },
  { key: "skills", to: "/skills", title: "Analyze my Skills", desc: "Find gaps. Get a learning path.", icon: Target, color: "from-[#4FD1C5] to-[#7BE3D9]" },
  { key: "interview", to: "/interview", title: "Practice Interview", desc: "Real questions. Kind feedback.", icon: Mic2, color: "from-[#FFB7A5] to-[#FFD1C3]" },
  { key: "story", to: "/story", title: "Career Break Story", desc: "Turn your break into strengths.", icon: Wand2, color: "from-[#7C6CF6] to-[#4FD1C5]" },
];

const STEPS = [
  { key: "resume", label: "Resume" },
  { key: "skills", label: "Skills" },
  { key: "story", label: "Story" },
  { key: "interview", label: "Interview" },
];

export default function Dashboard() {
  const [name, setName] = useState(getUserName());
  const [nameInput, setNameInput] = useState(getUserName());
  const [progress, setProgress] = useState({});
  const sessionId = getSessionId();

  const loadProgress = async () => {
    try {
      const r = await api.get(`/progress/${sessionId}`);
      setProgress(r.data?.steps || {});
    } catch (e) {}
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const completed = STEPS.filter((s) => progress[s.key]).length;
  const pct = Math.round((completed / STEPS.length) * 100);

  const saveName = () => {
    const n = nameInput.trim();
    if (n) {
      setUserName(n);
      setName(n);
    }
  };

  const resetDashboard = async () => {
    try {
      await api.delete(`/progress/${sessionId}`);
      setProgress({});
      toast.success("Fresh start — your dashboard is clear ✨");
    } catch (e) {
      toast.error("Could not reset. Try again?");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12" data-testid="dashboard-page">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6CF6] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Your comeback hub
          </div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl mt-3 text-[#1A1A24]" data-testid="dashboard-welcome">
            {name ? <>Welcome back, <span className="text-[#7C6CF6]">{name}</span>.</> : <>Welcome to ReLaunch.</>}
          </h1>
          <p className="text-gray-600 mt-3 flex items-center gap-1">
            You're doing great <Heart className="w-4 h-4 text-[#FFB7A5]" fill="#FFB7A5" /> Pick any step below — there's no wrong order.
          </p>
        </div>

        {!name && (
          <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-soft border border-gray-100">
            <Input
              placeholder="What should we call you?"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="border-0 focus-visible:ring-0 w-56"
              data-testid="dashboard-name-input"
            />
            <Button
              onClick={saveName}
              className="rounded-full bg-[#7C6CF6] hover:bg-[#5A4BD4] text-white"
              data-testid="dashboard-name-save"
            >
              Save
            </Button>
          </div>
        )}
      </motion.div>

      {/* Progress tracker */}
      <div className="mt-8 rounded-3xl bg-white border border-gray-100 p-6 shadow-soft" data-testid="progress-tracker">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-[#1A1A24]">Your journey</div>
            <div className="text-xs text-gray-500">{completed} of {STEPS.length} steps complete</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="font-heading font-bold text-2xl text-[#7C6CF6]">{pct}%</div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-gray-500 hover:text-[#B44B2E] hover:bg-[#FFE3DB]"
                  data-testid="dashboard-reset-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Start fresh
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-3xl" data-testid="reset-dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-heading">Reset your dashboard?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This clears your progress tracker and chat history on this device. Your saved name stays.
                    You can always begin again — no judgment.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-full" data-testid="reset-cancel-btn">Not now</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resetDashboard}
                    className="rounded-full bg-[#1A1A24] hover:bg-black"
                    data-testid="reset-confirm-btn"
                  >
                    Yes, start fresh
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Progress value={pct} className="mt-4 h-2 bg-[#F3F0FF]" />
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {STEPS.map((s) => {
            const done = !!progress[s.key];
            return (
              <div
                key={s.key}
                className={`rounded-2xl px-4 py-3 border text-sm flex items-center gap-2 ${
                  done
                    ? "bg-[#D9F5F1] border-[#4FD1C5]/30 text-[#0D8076]"
                    : "bg-[#F9FAFB] border-gray-100 text-gray-500"
                }`}
                data-testid={`progress-step-${s.key}`}
              >
                <CheckCircle2 className={`w-4 h-4 ${done ? "text-[#4FD1C5]" : "text-gray-300"}`} />
                {s.label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="font-heading font-semibold text-2xl text-[#1A1A24]">Quick actions</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-5">
          {QUICK_ACTIONS.map((a, i) => (
            <motion.div
              key={a.key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              <Link
                to={a.to}
                className="group block rounded-3xl bg-white border border-gray-100 p-7 shadow-soft card-lift"
                data-testid={`qa-${a.key}`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-soft shrink-0`}>
                    <a.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-xl text-[#1A1A24]">{a.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{a.desc}</p>
                    <div className="mt-4 text-sm font-medium text-[#7C6CF6] flex items-center gap-1 group-hover:gap-2 transition-all">
                      Let's go <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat tile */}
      <div className="mt-10 rounded-3xl bg-gradient-to-br from-[#7C6CF6] via-[#9D8EFA] to-[#FFB7A5] p-8 text-white shadow-soft relative overflow-hidden" data-testid="dashboard-chat-tile">
        <div className="absolute -right-6 -top-6 w-40 h-40 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <MessageCircleHeart className="w-6 h-6" />
            </div>
            <div>
              <div className="font-heading font-bold text-2xl">Need a pep talk?</div>
              <div className="text-white/90 text-sm">Your AI coach is always here — no judgment, just support.</div>
            </div>
          </div>
          <Link to="/chat" data-testid="dashboard-open-chat-btn">
            <Button className="rounded-full bg-white text-[#5A4BD4] hover:bg-[#F3F0FF] px-6">
              Open chat <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
