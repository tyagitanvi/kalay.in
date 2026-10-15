import { useState, useEffect, useRef } from "react";
import {
  Code,
  Layers,
  Cpu,
  Menu,
  X,
  Linkedin,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Cloud,
  ArrowUpRight,
  Copy,
  Check,
  Zap,
  Users,
  Globe,
} from "lucide-react";
import {
  motion,
  animate,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  useInView,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";

// Replace with your actual profile image asset
import profileImg from "../assets/profile.png";
import { ConstellationBackground } from "../animation/constellation";

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SECTION_LIST = [
  "about",
  "interactive-lab",
  "skills",
  "experience",
  "education",
  "contact",
];

const ACCENT_MAP: Record<string, string> = {
  orange: "from-orange-500 to-amber-400",
  cyan: "from-cyan-400 to-blue-500",
  emerald: "from-emerald-400 to-green-500",
  violet: "from-violet-500 to-purple-500",
};

const STATE_LABELS = {
  idle: "IDLE",
  request: "REQUEST SENT",
  processing: "PROCESSING",
  response: "RESPONSE RECEIVED",
};

type Engine = "spring" | "framer" | "tailwind" | "radix";
type RequestState = "idle" | "request" | "processing" | "response";

/* ==========================================================================
   1. MAGNETIC BUTTON
   ========================================================================== */
const MagneticButton = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 160 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reduce) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((e.clientX - (left + width / 2)) * 0.35);
    y.set((e.clientY - (top + height / 2)) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ==========================================================================
   2. TILT CARD (calm entrance, smoothed tilt, cursor spotlight)
   ========================================================================== */
const TiltCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const tiltConfig = { stiffness: 200, damping: 22 };
  const tiltX = useSpring(useTransform(y, [-150, 150], [6, -6]), tiltConfig);
  const tiltY = useSpring(useTransform(x, [-150, 150], [-6, 6]), tiltConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    if (!reduce) {
      x.set(e.clientX - (rect.left + rect.width / 2));
      y.set(e.clientY - (rect.top + rect.height / 2));
    }
    setSpotlightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setOpacity(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setOpacity(1)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
          className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0f1a1d]/60 backdrop-blur-2xl transition-[box-shadow,border-color] duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/40 ${className}`}
        >
          <div
            className="pointer-events-none absolute -inset-px transition-opacity duration-300"
            style={{
              opacity,
              background: `radial-gradient(450px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 138, 0, 0.2), transparent 50%)`,
            }}
          />
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   3. REUSABLE MOTION PRIMITIVES
   ========================================================================== */

/** Word-by-word masked rise. Gradient classes go on each word (bg-clip-text
 *  does not survive transformed children when set on the parent). */
const RevealText = ({
  text,
  className = "",
  wordClassName = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
}) => {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={`${className} ${wordClassName}`}>{text}</span>;
  }

  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.25em]"
          aria-hidden
        >
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.85, delay: delay + i * 0.07, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

/** Counts up from 0 when scrolled into view. */
const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) {
      ref.current.textContent = `${to}${suffix}`;
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix, reduce]);

  return <span ref={ref}>0{suffix}</span>;
};

/** Infinite horizontal ticker with faded edges. */
const Marquee = ({ items }: { items: string[] }) => {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative z-10 overflow-hidden border-y border-white/10 py-4 bg-white/[0.015] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]"
      aria-hidden
    >
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap font-mono text-xs tracking-[0.25em] text-white/40"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i}>
            {t} <span className="text-[#FF8A00] ml-12">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

/** Vertical line that draws itself as the section scrolls. */
const TimelineWrap = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={ref} className="relative pl-8 md:pl-12">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-white/10" />
      <motion.div
        style={{ height }}
        className="absolute left-2 top-0 w-px bg-gradient-to-b from-[#FF8A00] via-amber-400 to-transparent"
      />
      {children}
    </div>
  );
};

const SectionHeading = ({
  title,
  subtitle,
  description,
}: {
  title: string;
  subtitle?: string;
  description?: string;
}) => (
  <motion.div
    className="text-center space-y-3"
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, ease: EASE }}
  >
    <h2 className="text-3xl md:text-5xl font-black text-white">{title}</h2>
    {subtitle && (
      <p className="text-[#FF8A00] font-bold uppercase tracking-widest text-xs md:text-sm">
        {subtitle}
      </p>
    )}
    {description && (
      <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        {description}
      </p>
    )}
  </motion.div>
);

/* ==========================================================================
   4. INTERACTIVE LAB
   ========================================================================== */

const SpringLab = ({
  stiffness,
  damping,
}: {
  stiffness: number;
  damping: number;
}) => {
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [spin, setSpin] = useState(0);

  const stageIndex = { idle: -1, request: 1, processing: 2, response: 3 }[
    requestState
  ];

  const scale = { idle: 1, request: 1.15, processing: 1.35, response: 1 }[
    requestState
  ];

  const triggerRequest = async () => {
    if (requestState !== "idle") return;
    setRequestState("request");
    await new Promise((r) => setTimeout(r, 500));
    setRequestState("processing");
    setSpin((s) => s + 1);
    await new Promise((r) => setTimeout(r, 900));
    setRequestState("response");
    await new Promise((r) => setTimeout(r, 700));
    setRequestState("idle");
  };

  return (
    <>
      <div className="mb-10">
        <div className="text-xs font-mono text-orange-400 mb-3">
          01 / PHYSICS
        </div>
        <h3 className="text-2xl font-semibold">Latency & Resilience</h3>
        <p className="text-sm text-white/40 mt-2 max-w-lg">
          A backend request changes state asynchronously. The UI should
          communicate that transition instead of snapping between states. Drag
          the sliders, then run a request to feel the difference.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl grid grid-cols-4 gap-3 mb-16">
          {[
            ["01", "USER ACTION"],
            ["02", "API REQUEST"],
            ["03", "PROCESSING"],
            ["04", "RESPONSE"],
          ].map(([number, label], index) => {
            const active = index <= stageIndex;
            return (
              <div
                key={label}
                className={`p-3 sm:p-4 rounded-xl border text-center transition-all duration-500 ${
                  active
                    ? "border-orange-400/40 bg-orange-400/[0.06]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="text-[9px] font-mono text-white/30 mb-2">
                  {number}
                </div>
                <div
                  className={`text-[8px] sm:text-[9px] font-mono ${
                    active ? "text-orange-300" : "text-white/30"
                  }`}
                >
                  {label}
                </div>
              </div>
            );
          })}
        </div>

        <motion.div
          animate={{ scale, rotate: spin * 180 }}
          transition={{ type: "spring", stiffness, damping }}
          className="w-20 h-20 rounded-2xl border border-orange-400/50 bg-orange-400/10 flex items-center justify-center"
        >
          <div className="w-5 h-5 rounded-full bg-orange-400 shadow-[0_0_35px_rgba(251,146,60,.7)]" />
        </motion.div>

        <button
          onClick={triggerRequest}
          disabled={requestState !== "idle"}
          className="mt-16 px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          {requestState === "idle" ? "Simulate Request" : STATE_LABELS[requestState]}
        </button>
      </div>

      <div className="mt-8 pt-5 border-t border-white/10">
        <div className="font-mono text-xs text-white/30">UI STATE</div>
        <div className="mt-2 text-sm text-white/60">
          “The interface should feel responsive even when the system isn't
          instantaneous.”
        </div>
      </div>
    </>
  );
};

const FramerLab = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="mb-10">
        <div className="text-xs font-mono text-cyan-400 mb-3">02 / STATE</div>
        <h3 className="text-2xl font-semibold">Layout & Morphing</h3>
        <p className="text-sm text-white/40 mt-2 max-w-lg">
          The same data can occupy different UI states. Layout animation
          handles the transition without manually calculating positions.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className={`rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6 ${
            expanded ? "w-full max-w-2xl" : "w-72"
          }`}
        >
          <motion.div layout className="flex items-start gap-4">
            <motion.div
              layout
              className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center shrink-0"
            >
              <div className="w-3 h-3 rounded-full bg-cyan-400" />
            </motion.div>
            <div className="flex-1">
              <motion.div layout className="text-sm font-medium">
                Cloud Processing Job
              </motion.div>
              <motion.div layout className="text-xs text-white/30 mt-1">
                ID: JOB-2048
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/10 space-y-3 overflow-hidden"
              >
                {[
                  ["STATUS", "PROCESSING"],
                  ["WORKERS", "04"],
                  ["LATENCY", "184ms"],
                  ["THROUGHPUT", "1.8k/s"],
                ].map(([key, value]) => (
                  <div key={key} className="flex justify-between font-mono text-xs">
                    <span className="text-white/30">{key}</span>
                    <span className="text-cyan-300">{value}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mx-auto mt-8 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/[0.05] text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        {expanded ? "Collapse State" : "Expand State"}
      </button>

      <div className="mt-8 pt-5 border-t border-white/10">
        <div className="font-mono text-xs text-white/30">ENGINEERING IDEA</div>
        <div className="mt-2 text-sm text-white/60">
          Same data. Different UI state. Zero manual position calculations.
        </div>
      </div>
    </>
  );
};

const TokensLab = () => {
  const [themeAccent, setThemeAccent] = useState("orange");
  const [progress, setProgress] = useState(35);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const runProgress = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [20, 85, 45, 100].map((value, index) =>
      setTimeout(() => setProgress(value), index * 700),
    );
  };

  return (
    <>
      <div className="mb-10">
        <div className="text-xs font-mono text-emerald-400 mb-3">
          03 / DESIGN SYSTEM
        </div>
        <h3 className="text-2xl font-semibold">Tokens & Systems</h3>
        <p className="text-sm text-white/40 mt-2 max-w-lg">
          A design system isn't a collection of colors. Change one token and
          the entire interface responds.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        <div className="flex flex-wrap gap-3 mb-10">
          {Object.keys(ACCENT_MAP).map((accent) => (
            <button
              key={accent}
              onClick={() => setThemeAccent(accent)}
              aria-pressed={themeAccent === accent}
              className={`px-4 py-2 rounded-lg border text-xs capitalize transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                themeAccent === accent
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 text-white/40"
              }`}
            >
              {accent}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-sm font-medium">Deployment Health</div>
              <div className="text-xs text-white/30 mt-1">
                Production / API cluster
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ACCENT_MAP[themeAccent]} opacity-80 transition-all`}
            />
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/40">CPU</span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${ACCENT_MAP[themeAccent]}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                ["99.98%", "UPTIME"],
                ["184ms", "LATENCY"],
                ["1.8k/s", "THROUGHPUT"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-white/[0.03] p-4">
                  <div className="font-mono text-sm">{value}</div>
                  <div className="text-[9px] text-white/30 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={runProgress}
          className="mt-6 self-center px-5 py-2.5 rounded-xl border border-white/10 text-xs hover:bg-white/[0.05] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          Run System Update
        </button>
      </div>

      <div className="mt-8 pt-5 border-t border-white/10">
        <div className="font-mono text-xs text-white/30">DESIGN SYSTEM</div>
        <div className="mt-2 text-sm text-white/60">
          One token changes the visual language of the entire interface.
        </div>
      </div>
    </>
  );
};

const A11yLab = () => {
  const [lastKey, setLastKey] = useState<string | null>(null);

  const rows = [
    ["TAB", "Focus Manager"],
    ["↓", "Focusable Primitive"],
    ["ENTER", "Interaction"],
    [":focus-visible", "Accessible UI"],
  ];

  const keyMatches = (k: string, key: string) =>
    (key === "TAB" && k === "Tab") ||
    (key === "↓" && k === "ArrowDown") ||
    (key === "ENTER" && k === "Enter");

  return (
    <>
      <div className="mb-10">
        <div className="text-xs font-mono text-violet-400 mb-3">
          04 / ACCESSIBILITY
        </div>
        <h3 className="text-2xl font-semibold">Focus & Primitives</h3>
        <p className="text-sm text-white/40 mt-2 max-w-lg">
          Accessibility isn't a final styling pass. Interaction state should
          exist at the primitive level. Tab through the buttons below and watch
          the trace respond.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="text-[10px] font-mono text-white/30 mb-5">
            KEYBOARD INTERACTION TRACE
          </div>
          <div className="space-y-3">
            {rows.map(([key, value], index) => {
              const hit = lastKey ? keyMatches(lastKey, key) : false;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.12 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border bg-black/20 transition-colors duration-300 ${
                    hit ? "border-violet-400/60" : "border-white/10"
                  }`}
                >
                  <div className="min-w-24">
                    <span className="px-2 py-1 rounded-md bg-violet-400/10 border border-violet-400/20 text-[9px] font-mono text-violet-300">
                      {key}
                    </span>
                  </div>
                  <div className="text-xs text-white/50">→</div>
                  <div className="text-sm text-white/70">{value}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div
          className="flex flex-wrap justify-center gap-3 mt-8"
          onKeyDown={(e) => setLastKey(e.key)}
        >
          {["Button", "Another Button", "Focus Me"].map((label) => (
            <button
              key={label}
              className="px-5 py-3 rounded-xl border border-white/10 text-sm hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 transition"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-white/10">
        <div className="font-mono text-xs text-white/30">ARCHITECTURE</div>
        <div className="mt-2 text-sm text-white/60">
          Interaction state is part of the architecture — not decoration.
        </div>
      </div>
    </>
  );
};

const InteractiveLab = () => {
  const [activeEngine, setActiveEngine] = useState<Engine>("spring");
  const [springStiffness, setSpringStiffness] = useState(180);
  const [springDamping, setSpringDamping] = useState(12);

  const experiments: { id: Engine; label: string; title: string }[] = [
    { id: "spring", label: "PHYSICS", title: "Latency & Resilience" },
    { id: "framer", label: "STATE", title: "Layout & Morphing" },
    { id: "tailwind", label: "DESIGN", title: "Tokens & Systems" },
    { id: "radix", label: "ACCESSIBILITY", title: "Focus & Primitives" },
  ];

  return (
    <section
      id="interactive-lab"
      className="relative py-20 md:py-28 px-4 sm:px-6 overflow-hidden z-10"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-16">
          <SectionHeading
            title="Interactive Systems Lab"
            description="Small experiments in state, motion, accessibility and UI architecture — where interaction explains what the system is actually doing."
          />
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* LEFT: controls */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] backdrop-blur-xl p-4 h-fit">
            <div className="px-3 py-3 mb-3">
              <div className="text-[10px] font-mono tracking-[0.2em] text-white/30">
                EXPERIMENTS
              </div>
            </div>

            {experiments.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveEngine(item.id)}
                aria-pressed={activeEngine === item.id}
                className={`w-full text-left p-4 rounded-2xl mb-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  activeEngine === item.id
                    ? "bg-white/[0.08] border border-white/10"
                    : "hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <div className="text-[9px] font-mono tracking-[0.2em] text-orange-400 mb-1">
                  {item.label}
                </div>
                <div className="text-sm font-medium text-white/80">
                  {item.title}
                </div>
              </button>
            ))}

            {activeEngine === "spring" && (
              <div className="mt-6 px-3 pb-2 space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <label htmlFor="stiffness" className="text-white/40">
                      STIFFNESS
                    </label>
                    <span className="font-mono text-white/60">
                      {springStiffness}
                    </span>
                  </div>
                  <input
                    id="stiffness"
                    type="range"
                    min="50"
                    max="400"
                    value={springStiffness}
                    onChange={(e) => setSpringStiffness(Number(e.target.value))}
                    className="w-full accent-orange-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <label htmlFor="damping" className="text-white/40">
                      DAMPING
                    </label>
                    <span className="font-mono text-white/60">
                      {springDamping}
                    </span>
                  </div>
                  <input
                    id="damping"
                    type="range"
                    min="5"
                    max="40"
                    value={springDamping}
                    onChange={(e) => setSpringDamping(Number(e.target.value))}
                    className="w-full accent-orange-400"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: preview */}
          <div className="rounded-3xl border border-white/10 bg-black/30 overflow-hidden min-h-[620px] flex flex-col">
            <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/30 tracking-[0.2em]">
                  LIVE PREVIEW
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-mono text-orange-400">
                  {activeEngine.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-400/60" />
                <span className="w-2 h-2 rounded-full bg-green-400/60" />
              </div>
            </div>

            <div className="p-6 md:p-12 flex-1 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEngine}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  {activeEngine === "spring" && (
                    <SpringLab
                      stiffness={springStiffness}
                      damping={springDamping}
                    />
                  )}
                  {activeEngine === "framer" && <FramerLab />}
                  {activeEngine === "tailwind" && <TokensLab />}
                  {activeEngine === "radix" && <A11yLab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================================================
   5. MAIN APPLICATION
   ========================================================================== */
function MyProfile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const reduce = useReducedMotion();

  /* --- cursor glow --- */
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorSpringX = useSpring(cursorX, { damping: 25, stiffness: 250 });
  const cursorSpringY = useSpring(cursorY, { damping: 25, stiffness: 250 });

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  /* --- page scroll progress --- */
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  /* --- hero parallax --- */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroYRaw = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroOpacityRaw = useTransform(heroProgress, [0, 0.8], [1, 0]);
  const avatarYRaw = useTransform(heroProgress, [0, 1], [0, 60]);

  /* --- data --- */
  const stats: {
    label: string;
    to?: number;
    suffix?: string;
    text?: string;
    icon: React.ReactNode;
  }[] = [
    {
      label: "Years Experience",
      to: 6,
      suffix: "+",
      icon: <Zap className="text-[#FF8A00]" size={18} />,
    },
    {
      label: "No. of projects",
      to: 10,
      suffix: "+",
      icon: <Layers className="text-emerald-400" size={18} />,
    },
    {
      label: "Client Stakeholders",
      text: "Global",
      icon: <Globe className="text-emerald-400" size={18} />,
    },
    {
      label: "Total Engineers Mentored",
      to: 50,
      suffix: "+",
      icon: <Users className="text-emerald-400" size={18} />,
    },
  ];

  const skills = {
    "Languages & Core": ["Python", "TypeScript", "JavaScript", "SQL", "HTML5/CSS3"],
    "Frontend Architecture": ["React", "Next.js", "React Native", "Dash", "TailwindCSS"],
    "Backend & Distributed APIs": ["FastAPI", "Django", "REST APIs", "Celery", "Microservices"],
    "Enterprise AI & Data": [
      "LLMs",
      "LangChain",
      "RAG Architecture",
      "Prompt Engineering",
      "NVIDIA H200 GPUs",
      "Plotly",
    ],
    "Cloud & DevOps": [
      "Docker",
      "Kubernetes",
      "Azure",
      "Air-gapped systems",
      "CI/CD Pipelines",
      "Firebase",
    ],
  };

  const skillIcons = [
    <Code size={24} />,
    <Layers size={24} />,
    <Cpu size={24} />,
    <Sparkles size={24} />,
    <Cloud size={24} />,
  ];

  const experiences = [
    {
      company: "Neuralix.ai",
      role: "Senior Software Engineer",
      period: "July 2025 - Sept 2025",
      badge: "On-Premise Defense AI",
      highlights: [
        "Architected an on-premise AI platform for a defense client using React (TypeScript), FastAPI, SQL, Docker, and NVIDIA H200 GPUs in under 3 months.",
        "Engineered Saarthi AI office suite & enterprise LLM foundations, reducing daily administrative tasks by ~50%.",
        "Configured secure containerized pipelines ensuring repeatable, zero-leakage air-gapped bare-metal deployments.",
        "Enforced repository governance and Git workflows, shrinking deployment release cycles by 20%.",
      ],
    },
    {
      company: "Builder.ai",
      role: "Software Engineer",
      period: "Nov 2023 - May 2025",
      badge: "Cloud Scale Platforms",
      highlights: [
        "Architected CloudLens Pricing Calculator (React, Next.js, Django), collapsing calculation runtimes from 3+ days to under 90 minutes.",
        "Engineered Guardian internal AI-enabled support platform with Celery & Django, cutting support ticket turnaround by 30%.",
        "Spearheaded shared UI design systems and code review frameworks across cross-functional engineering teams.",
      ],
    },
    {
      company: "MuSigma Inc.",
      role: "Analytics Consultant",
      period: "Aug 2019 - Oct 2023",
      badge: "Big Data & Supply Chain",
      highlights: [
        "Led 5 engineers to migrate 150+ JDA data assets to Blue Yonder cloud SaaS (13+ solutions, 88 views), reducing cloud storage footprint by 2+ PB (~30% cost savings).",
        "Directed DevOps across 90+ enterprise analytics products with a 15-member team, reducing incidents by 25%.",
        "Engineered Quota Allocation Engine (React, Django, SQL), reducing processing time from 10 days to 10 minutes ($17M/yr business impact).",
        "Developed executive supply chain monitoring dashboards in Python/Dash, speeding up bottleneck discovery by 20%.",
      ],
    },
  ];

  const marqueeItems = [
    "$17M/YR BUSINESS VALUE",
    "2+ PB STORAGE SAVED",
    "AIR-GAPPED ENTERPRISE AI",
    "NVIDIA H200 DEPLOYMENTS",
    "~50% LESS ADMIN WORK",
    "10 DAYS → 10 MINUTES",
  ];

  /* --- actions --- */
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("tyagitanvi2205@gmail.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      window.location.href = "mailto:tyagitanvi2205@gmail.com";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of SECTION_LIST) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      window.scrollTo({
        top: elementRect - bodyRect - offset,
        behavior: reduce ? "auto" : "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  const gradientWord =
    "bg-gradient-to-r from-[#FF8A00] via-amber-300 to-orange-500 bg-clip-text text-transparent";

  return (
    <div className="min-h-screen bg-[#0b1214] font-['Nunito_Sans'] text-slate-100 selection:bg-[#FF8A00] selection:text-black overflow-x-hidden relative cursor-default">
      <ConstellationBackground />

      {/* Cursor glow follower */}
      <motion.div
        className="fixed w-44 h-44 rounded-full bg-[#FF8A00]/10 blur-3xl pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform"
        style={{ left: cursorSpringX, top: cursorSpringY }}
      />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF8A00] via-amber-400 to-orange-600 z-[120] origin-left shadow-lg shadow-orange-500/50"
        style={{ scaleX }}
      />

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-[#FF8A00]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[160px]" />
      </div>

      {/* ------------------------------ NAVBAR ------------------------------ */}
      <nav className="fixed top-0 left-0 right-0 bg-[#0b1214]/80 backdrop-blur-xl border-b border-white/10 z-[100]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <MagneticButton>
              <div
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => scrollToSection("about")}
              >
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8A00] to-amber-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                  TT
                </div>
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-black tracking-tight text-white group-hover:text-[#FF8A00] transition-colors leading-none">
                    TANVI TYAGI
                  </span>
                  <span className="text-[10px] text-[#FF8A00] font-mono font-bold tracking-widest uppercase mt-0.5">
                    SENIOR FULL-STACK
                  </span>
                </div>
              </div>
            </MagneticButton>

            <div className="hidden md:flex space-x-6 items-center">
              {SECTION_LIST.map((sec) => (
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className={`capitalize text-xs lg:text-sm font-bold tracking-wide transition-all relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded ${
                    activeSection === sec
                      ? "text-[#FF8A00]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sec.replace(/-/g, " ")}
                  {activeSection === sec && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full shadow-md shadow-orange-500"
                    />
                  )}
                </button>
              ))}
              <MagneticButton>
                <a
                  href="mailto:tyagitanvi2205@gmail.com"
                  className="bg-[#FF8A00] text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-amber-400 transition-all shadow-lg shadow-orange-500/25 block"
                >
                  Hire Me
                </a>
              </MagneticButton>
            </div>

            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#101a1d] border-b border-white/10 px-4 py-4 space-y-2 overflow-hidden"
            >
              {SECTION_LIST.map((sec) => (
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className="block w-full text-left p-3 capitalize font-bold text-slate-300 hover:bg-[#FF8A00]/10 hover:text-[#FF8A00] rounded-xl transition-all"
                >
                  {sec.replace(/-/g, " ")}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ------------------------------- HERO ------------------------------- */}
      <section
        id="about"
        ref={heroRef}
        className="relative pt-32 md:pt-48 pb-20 md:pb-28 px-4 z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-12 items-center">
          <motion.div
            style={reduce ? undefined : { y: heroYRaw, opacity: heroOpacityRaw }}
            className="space-y-6 text-center md:text-left md:col-span-7 order-2 md:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 text-[#FF8A00] bg-[#FF8A00]/10 border border-[#FF8A00]/30 font-mono text-xs px-3.5 py-1.5 rounded-full"
            >
              <span className="w-2 h-2 rounded-full bg-[#76e04c] motion-safe:animate-ping" />
              <span>FULL-STACK & ENTERPRISE AI ARCHITECT</span>
            </motion.div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.08] tracking-tight">
              <RevealText text="Engineering Resilient" delay={0.15} />
              <br />
              <RevealText
                text="Production Platforms"
                wordClassName={gradientWord}
                delay={0.45}
              />
              <br />
              <RevealText text="With Precision." delay={0.85} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed mx-auto md:mx-0"
            >
              Senior Software Engineer with 6+ years of experience delivering
              scalable enterprise AI systems, real-time analytics engines, and
              resilient cloud architectures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.25 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-400 justify-center md:justify-start pt-2">
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                  <MapPin size={15} className="text-[#FF8A00]" /> Noida, India
                </span>
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl hover:border-orange-500/50 transition-all text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  <Mail size={15} className="text-[#FF8A00]" />{" "}
                  tyagitanvi2205@gmail.com
                  {copiedEmail ? (
                    <Check size={14} className="text-emerald-400" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                <MagneticButton>
                  <button
                    onClick={() => scrollToSection("interactive-lab")}
                    className="w-full sm:w-auto bg-gradient-to-r from-[#FF8A00] to-orange-600 text-slate-950 px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Explore UI Lab</span>
                    <ArrowUpRight size={18} />
                  </button>
                </MagneticButton>
                <MagneticButton>
                  <a
                    href="https://linkedin.com/in/tanvi-tyagi/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto bg-white/5 border border-white/15 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
                  >
                    <Linkedin size={18} /> LinkedIn Profile
                  </a>
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            style={reduce ? undefined : { y: avatarYRaw }}
            className="relative md:col-span-5 order-1 md:order-2 flex justify-center items-center"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 aspect-square">
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#FF8A00] via-amber-500 to-teal-500 rounded-full blur-2xl opacity-40" />
              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/20 bg-slate-900 aspect-square">
                <img
                  src={profileImg}
                  alt="Tanvi Tyagi"
                  className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {stats.map((st, i) => (
            <TiltCard key={st.label} className="p-6 text-center" delay={i * 0.08}>
              <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                {st.icon}
              </div>
              <div className="text-2xl md:text-4xl font-black text-white">
                {st.to !== undefined ? (
                  <Counter to={st.to} suffix={st.suffix} />
                ) : (
                  st.text
                )}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                {st.label}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* ---------------------------- INTERACTIVE LAB ---------------------------- */}
      <InteractiveLab />

      {/* -------------------------------- SKILLS -------------------------------- */}
      <section id="skills" className="py-20 md:py-28 px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <SectionHeading
            title="Full-Stack & AI Stack"
            subtitle="Built For Performance & Scale"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <TiltCard key={category} className="p-6 md:p-8" delay={(idx % 3) * 0.08}>
                <div className="w-12 h-12 bg-[#FF8A00]/10 border border-[#FF8A00]/20 rounded-2xl flex items-center justify-center text-[#FF8A00] mb-6">
                  {skillIcons[idx]}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-white/5 border border-white/10 text-slate-300 font-semibold px-3 py-1.5 rounded-xl hover:border-[#FF8A00]/50 hover:text-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ EXPERIENCE ------------------------------ */}
      <section
        id="experience"
        className="py-20 md:py-28 px-4 bg-[#0f1a1d]/50 border-y border-white/10 relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-14">
          <SectionHeading
            title="Engineering Experience"
            subtitle="End-To-End Delivery & Architecture"
          />

          <TimelineWrap>
            <div className="space-y-8">
              {experiences.map((exp) => (
                <div key={exp.company} className="relative">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="absolute -left-[30px] md:-left-[46px] top-9 w-3 h-3 rounded-full bg-[#FF8A00] shadow-[0_0_14px_rgba(255,138,0,.8)]"
                  />
                  <TiltCard className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                          <Briefcase size={20} className="text-[#FF8A00]" />{" "}
                          {exp.role}
                        </h3>
                        <p className="text-[#FF8A00] font-semibold text-sm mt-0.5">
                          {exp.company} •{" "}
                          <span className="text-cyan-400 font-mono text-xs">
                            {exp.badge}
                          </span>
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-slate-300 w-fit">
                        {exp.period}
                      </span>
                    </div>

                    <ul className="space-y-3 text-slate-300 text-sm md:text-base">
                      {exp.highlights.map((point, pIdx) => (
                        <motion.li
                          key={pIdx}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.5, delay: pIdx * 0.08 }}
                          className="flex items-start gap-3"
                        >
                          <ChevronRight
                            size={18}
                            className="text-[#FF8A00] flex-shrink-0 mt-1"
                          />
                          <span className="leading-relaxed">{point}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </TiltCard>
                </div>
              ))}
            </div>
          </TimelineWrap>
        </div>
      </section>

      {/* ------------------------------ EDUCATION ------------------------------ */}
      <section id="education" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <TiltCard className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF8A00] to-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20 font-black">
                <GraduationCap size={34} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">
                  Bachelor of Engineering (B.E.)
                </h3>
                <p className="text-slate-300 font-medium">Computer Engineering</p>
                <p className="text-xs text-[#FF8A00] font-mono font-bold mt-1">
                  Institute of Engineering and Technology, DAVV, Indore (2015 –
                  2019)
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ------------------------------- CONTACT ------------------------------- */}
      <section
        id="contact"
        className="py-20 md:py-28 px-4 bg-[#080e10] border-t border-white/10 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            <RevealOnView text="Let's Engineer The Future" />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-slate-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed"
          >
            Open to senior full-stack engineering, system architecture roles,
            and enterprise AI initiatives.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <MagneticButton>
              <button
                onClick={copyEmail}
                className="bg-gradient-to-r from-[#FF8A00] to-orange-600 text-slate-950 px-7 py-4 rounded-2xl font-black hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-orange-500/25"
              >
                <Mail size={18} />{" "}
                {copiedEmail ? "Copied Email!" : "tyagitanvi2205@gmail.com"}
              </button>
            </MagneticButton>
            <MagneticButton>
              <a
                href="https://linkedin.com/in/tanvi-tyagi/"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 border border-white/15 text-white px-7 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2 backdrop-blur-md"
              >
                <Linkedin size={18} /> Connect on LinkedIn
              </a>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* -------------------------------- FOOTER -------------------------------- */}
      <footer className="bg-[#060a0b] text-slate-600 py-8 px-4 border-t border-white/5 text-center text-xs font-mono">
        © 2026 Tanvi Tyagi • Full-Stack & Enterprise AI Engineering.
      </footer>
    </div>
  );
}

/** Same masked word rise as RevealText, but triggered when scrolled into view.
 *  The observer targets the unclipped outer wrapper: words that sit fully
 *  inside an overflow-hidden mask report zero visibility and never trigger. */
const RevealOnView = ({ text }: { text: string }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  if (reduce) return <>{text}</>;

  return (
    <span ref={ref} className="block" aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom pb-[0.08em] mr-[0.25em]"
          aria-hidden
        >
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: inView ? 0 : "110%" }}
            transition={{ duration: 0.8, delay: i * 0.07, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

export default MyProfile;