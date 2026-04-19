import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  FileText,
  Target,
  Mic2,
  MessageCircleHeart,
  ArrowRight,
  Quote,
  ShieldCheck,
  Wand2,
  Compass,
} from "lucide-react";

const HERO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/08ed13a0-5b84-47f7-9e69-36d56be68859/images/518c4f8dee020421f0a3e44e5af800d64ae69d1a982f739e703866989c409610.png";
const GROWTH_IMG =
  "https://static.prod-images.emergentagent.com/jobs/08ed13a0-5b84-47f7-9e69-36d56be68859/images/5e0e404d2cdfcf03ca92e0b463b8c2ab6ddcb0d7db7d624b9707ac2fe0aed37d.png";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const features = [
  {
    icon: FileText,
    title: "Resume Enhancer",
    text: "Rewrite your resume with confidence. We reframe your career break as growth — never a gap.",
    color: "from-[#7C6CF6] to-[#A08CFA]",
    to: "/resume",
  },
  {
    icon: Target,
    title: "Skill Gap Analyzer",
    text: "Compare your skills with your dream role. Get a clear, prioritized learning path.",
    color: "from-[#4FD1C5] to-[#7BE3D9]",
    to: "/skills",
  },
  {
    icon: Mic2,
    title: "Interview Coach",
    text: "Practice real questions — including the career break one — and get kind, honest feedback.",
    color: "from-[#FFB7A5] to-[#FFD1C3]",
    to: "/interview",
  },
  {
    icon: Wand2,
    title: "Career Break Story Generator",
    text: "Turn your time away into resume-ready strengths. Your experience is your superpower.",
    color: "from-[#7C6CF6] to-[#4FD1C5]",
    to: "/story",
  },
  {
    icon: MessageCircleHeart,
    title: "AI Chat Coach",
    text: "A warm, always-available coach. Ask anything — from nerves to negotiation.",
    color: "from-[#FFB7A5] to-[#7C6CF6]",
    to: "/chat",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    text: "Your resume and story stay yours. No public training, no judgment — just growth.",
    color: "from-[#4FD1C5] to-[#7C6CF6]",
    to: "/dashboard",
  },
];

const steps = [
  {
    n: "01",
    title: "Tell us where you are",
    text: "Upload a resume or share your story. We meet you where you are — no pressure.",
    icon: Compass,
  },
  {
    n: "02",
    title: "AI rewrites & reframes",
    text: "Your experience gets polished. Your break becomes a narrative of growth.",
    icon: Wand2,
  },
  {
    n: "03",
    title: "Walk in confident",
    text: "Practice interviews, close skill gaps, and step back in with your head high.",
    icon: Sparkles,
  },
];

const testimonials = [
  {
    quote:
      "After 4 years away for my kids, I didn't know how to talk about my break. ReLaunch made me sound like the professional I actually am.",
    name: "Priya M.",
    role: "Product Manager · Bengaluru",
  },
  {
    quote:
      "The interview coach was brutally kind. I got 3 callbacks in two weeks. I felt like I had a best friend in my corner.",
    name: "Aisha R.",
    role: "UX Designer · Dubai",
  },
  {
    quote:
      "I rewrote 8 years of experience in 10 minutes. The 'career break reframed' section literally made me tear up.",
    name: "Megha S.",
    role: "Software Engineer · Pune",
  },
];

export default function Landing() {
  return (
    <div data-testid="landing-page">
      {/* HERO */}
      <section className="hero-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            animate="show"
            variants={fadeUp}
          >
            <motion.div
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-[#ECE9FE] px-4 py-1.5 text-xs font-medium text-[#5A4BD4] shadow-soft"
              data-testid="hero-badge"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Your comeback, powered by AI
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight mt-6 text-[#1A1A24]"
              data-testid="hero-headline"
            >
              Restart Your Career{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#7C6CF6] to-[#FFB7A5] bg-clip-text text-transparent">
                  with Confidence
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-[#FFE3DB] rounded-full -z-0" />
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="text-lg text-gray-600 mt-6 max-w-xl leading-relaxed"
              data-testid="hero-subtext"
            >
              AI-powered support for women returning after a career break. We rewrite your resume, close your skill
              gaps, rehearse your interviews, and remind you: your time away was never time wasted.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link to="/dashboard" data-testid="hero-get-started-btn">
                <Button className="rounded-full px-7 py-6 text-base bg-[#1A1A24] hover:bg-black text-white shadow-lift group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/chat" data-testid="hero-chat-btn">
                <Button
                  variant="outline"
                  className="rounded-full px-7 py-6 text-base border-2 border-[#ECE9FE] bg-white/70 hover:bg-[#F3F0FF] text-[#1A1A24]"
                >
                  Talk to your coach
                </Button>
              </Link>
            </motion.div>

            <motion.div
              custom={4}
              variants={fadeUp}
              className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {["#FFB7A5", "#7C6CF6", "#4FD1C5"].map((c) => (
                    <div
                      key={c}
                      className="w-8 h-8 rounded-full border-2 border-white"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <span>12,000+ women restarting</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4FD1C5]" />
                Private & judgment-free
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-lift bg-white/40 border border-white/60">
              <img
                src={HERO_IMG}
                alt="Soft 3D abstract shapes representing career growth"
                className="w-full h-[460px] object-cover"
                data-testid="hero-image"
              />
              <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl p-4 flex items-center gap-3 shadow-soft">
                <div className="w-10 h-10 rounded-xl bg-[#ECE9FE] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#7C6CF6]" />
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-[#1A1A24]">Your career break, reframed.</div>
                  <div className="text-gray-500 text-xs">AI translates life into leadership.</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-3xl bg-[#FFE3DB] animate-float-slow -z-0" />
            <div className="absolute -bottom-4 -right-3 w-20 h-20 rounded-2xl bg-[#D9F5F1] animate-float-slow -z-0" />
          </motion.div>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20" data-testid="problem-section">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C6CF6]">
              Why ReLaunch exists
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-4 text-[#1A1A24]">
              Your career didn't pause.{" "}
              <span className="text-[#7C6CF6]">It evolved.</span>
            </h2>
            <p className="text-gray-600 mt-5 leading-relaxed">
              Returning after a break is hard — not because you've lost skills, but because the world forgot to make
              space for you. We're changing that. No gap-shame. No cold keyword games. Just a coach that believes
              in you and speaks fluent hiring manager.
            </p>
          </div>
          <div className="md:col-span-7 grid sm:grid-cols-2 gap-5">
            {[
              { t: "43% of women", s: "return to work after a career break each year." },
              { t: "Only 1 in 10", s: "feel confident explaining the break in interviews." },
              { t: "74% say", s: "their real challenge is confidence, not skills." },
              { t: "100% of you", s: "deserve a coach that sees the whole you." },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-3xl bg-white border border-gray-100 p-6 shadow-soft card-lift"
              >
                <div className="font-heading font-bold text-2xl text-[#7C6CF6]">{c.t}</div>
                <div className="text-sm text-gray-600 mt-2">{c.s}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gradient-to-b from-white to-[#F9FAFB]" data-testid="how-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#4FD1C5]">
              How it works
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-4 text-[#1A1A24]">
              Three soft steps back to work.
            </h2>
            <p className="text-gray-600 mt-4">No cold forms. No jargon. Just the kind of guidance you'd get from a friend who happens to be a career expert.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-3xl bg-white p-8 border border-gray-100 shadow-soft relative overflow-hidden card-lift"
                data-testid={`how-step-${i + 1}`}
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#F3F0FF]" />
                <div className="relative">
                  <div className="text-[#7C6CF6] font-heading font-bold text-3xl">{s.n}</div>
                  <div className="mt-4 w-11 h-11 rounded-2xl bg-[#ECE9FE] flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-[#7C6CF6]" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mt-5 text-[#1A1A24]">{s.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-relaxed">{s.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES BENTO */}
      <section className="py-24" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB7A5]">
                Everything you need
              </div>
              <h2 className="font-heading font-bold text-3xl sm:text-4xl mt-4 text-[#1A1A24] max-w-xl">
                A complete comeback companion.
              </h2>
            </div>
            <Link to="/dashboard" className="text-sm text-[#7C6CF6] hover:underline" data-testid="features-all-link">
              Explore everything →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
              >
                <Link
                  to={f.to}
                  className="block h-full rounded-3xl bg-white border border-gray-100 p-7 shadow-soft card-lift"
                  data-testid={`feature-card-${i}`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-soft`}>
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl mt-5 text-[#1A1A24]">{f.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{f.text}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-sm text-[#7C6CF6] font-medium">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GROWTH IMAGE STRIP */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24">
        <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-soft grid lg:grid-cols-2 items-center">
          <div className="p-10 lg:p-14">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#4FD1C5]">Unique</div>
            <h3 className="font-heading font-bold text-3xl sm:text-4xl mt-4 text-[#1A1A24]">
              Career Break Story Generator
            </h3>
            <p className="text-gray-600 mt-4 leading-relaxed max-w-md">
              Raised two kids? Volunteered? Took care of a parent? That's not nothing — that's leadership,
              logistics, and empathy. We translate your break into resume-ready strengths.
            </p>
            <Link to="/story" data-testid="growth-cta-btn">
              <Button className="mt-7 rounded-full bg-[#7C6CF6] hover:bg-[#5A4BD4] text-white px-6">
                Generate my story <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="relative h-80 lg:h-[420px]">
            <img
              src={GROWTH_IMG}
              alt="Career staircase representing growth"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="pb-24" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#1A1A24] max-w-2xl">
            Women who restarted. <span className="text-[#FFB7A5]">Loudly.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="rounded-3xl bg-white border border-gray-100 p-7 shadow-soft"
                data-testid={`testimonial-${i}`}
              >
                <Quote className="w-6 h-6 text-[#FFB7A5]" />
                <p className="text-gray-700 mt-4 leading-relaxed">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C6CF6] to-[#FFB7A5]" />
                  <div>
                    <div className="font-semibold text-sm text-[#1A1A24]">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#7C6CF6] via-[#9D8EFA] to-[#FFB7A5] p-10 lg:p-16 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-60 h-60 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-10 w-80 h-80 rounded-full bg-white/10" />
            <div className="relative max-w-2xl">
              <h2 className="font-heading font-bold text-3xl sm:text-5xl leading-tight">
                Your comeback story starts today.
              </h2>
              <p className="mt-5 text-white/90 text-lg">
                It takes 10 minutes. It could change the next 10 years.
              </p>
              <Link to="/dashboard" data-testid="final-cta-btn">
                <Button className="mt-8 rounded-full bg-white text-[#5A4BD4] hover:bg-[#F3F0FF] px-8 py-6 text-base font-semibold">
                  Start my comeback <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
