
import { useState, useEffect, useRef } from "react";
import {
  Code,
  Layers,
  Cpu,
  Terminal,
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
  Activity,
  Server,
  Play,
  Shield,
  Smartphone,
  Gauge,
  HardDrive,
  RefreshCw,
  Bell,
  Calendar,
  Sliders,
  SlidersHorizontal,
  Box,
  CornerDownLeft,
  Wand2,
  Atom,
  Flame,
  Layout,
} from "lucide-react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// Replace with your actual profile image asset
import profileImg from "../assets/profile.png";

const ACCENT_OPTIONS = [
  {
    name: "Orange-500",
    hex: "#F97316",
    text: "text-orange-400",
    bg: "bg-orange-500/20",
    border: "border-orange-500/40",
    accent: "from-[#ffffff] to-orange-400",
  },
  {
    name: "Cyan-400",
    hex: "#22D3EE",
    text: "text-cyan-400",
    bg: "bg-cyan-500/20",
    border: "border-cyan-500/40",
    accent: "from-[#ffffff] to-cyan-400",
  },
  {
    name: "Emerald-400",
    hex: "#34D399",
    text: "text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/40",
    accent: "from-[#ffffff] to-emrald-400",
  },
  {
    name: "Violet-400",
    hex: "#A78BFA",
    text: "text-violet-400",
    bg: "bg-violet-500/20",
    border: "border-violet-500/40",
    accent: "from-[#ffffff] to-violet-400",
  },
];

const SURFACE_OPTIONS = [
  {
    name: "Slate-950",
    bgClass: "bg-slate-950",
    borderClass: "border-slate-800",
  },
  { name: "Zinc-900",
     bgClass: "bg-zinc-900",
      borderClass: "border-zinc-800" },
  {
    name: "Neutral-900",
    bgClass: "bg-neutral-900",
    borderClass: "border-neutral-800",
  },
];

// ==========================================
// 1. MAGNETIC BUTTON (PHYSICS-BASED CURSOR)
// ==========================================
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 160 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    x.set((clientX - (left + width / 2)) * 0.35);
    y.set((clientY - (top + height / 2)) * 0.35);
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

// ==========================================
// 2. 3D FLIP ENTRANCE & MOUSE-TILT CARD
// ==========================================
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const tiltX = useTransform(y, [-120, 120], [8, -8]);
  const tiltY = useTransform(x, [-120, 120], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
    setSpotlightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} className="w-full">
      <motion.div
        initial={{ rotateY: -180, opacity: 0, scale: 0.8 }}
        whileInView={{ rotateY: 0, opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{
          duration: 0.95,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          ref={cardRef}
          // onMouseMove={handleMouseMove}
          onMouseEnter={() => setOpacity(1)}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformStyle: "preserve-3d",
          }}
          className={`relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-2xl transition-shadow duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/40 ${className}`}
        >
          <div
            className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
            style={{
              opacity,
              background: `radial-gradient(450px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 138, 0, 0.22), transparent 50%)`,
            }}
          />
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
};

// ==========================================
// 3. REACT ECOSYSTEM & UI PLAYGROUND
// ==========================================
const ReactEcosystemPlayground = () => {
  const [activeEngine, setActiveEngine] = useState<
    "spring" | "framer" | "tailwind" | "radix"
  >("spring");
  const [springStiffness, setSpringStiffness] = useState(180);
  const [springDamping, setSpringDamping] = useState(12);
  const [isTriggered, setIsTriggered] = useState(false);

  const [accent, setAccent] = useState(ACCENT_OPTIONS[0]);
  const [surface, setSurface] = useState(SURFACE_OPTIONS[0]);

  const triggerAnimation = () => {
    setIsTriggered(true);
    setTimeout(() => setIsTriggered(false), 900);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Atom
              size={18}
              className="text-[#FF8A00] animate-spin"
              style={{ animationDuration: "8s" }}
            />
            <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              React UI & Motion Lab
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Test and benchmark React physics, layout engines, and design system
            architectures in real time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-full">
            LIVE COMPILATION
          </span>
        </div>
      </div>

      {/* Library Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          {
            id: "spring",
            name: "Spring Physics",
            tag: "react-spring / motion",
          },
          { id: "framer", name: "Layout Morph", tag: "Framer Motion" },
          { id: "tailwind", name: "Design Tokens", tag: "Tailwind JIT" },
          {
            id: "radix",
            name: "Headless Primitives",
            tag: "Radix UI / Shadcn",
          },
        ].map((lib) => (
          <button
            key={lib.id}
            onClick={() => setActiveEngine(lib.id as any)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              activeEngine === lib.id
                ? "bg-[#FF8A00] text-black border-orange-400 shadow-lg shadow-orange-500/20"
                : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20"
            }`}
          >
            <div className="text-xs font-black">{lib.name}</div>
            <div
              className={`text-[10px] font-mono ${activeEngine === lib.id ? "text-slate-900 font-bold" : "text-slate-500"}`}
            >
              {lib.tag}
            </div>
          </button>
        ))}
      </div>

      {/* Dynamic Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-black/40 p-6 rounded-2xl border border-white/10">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-4 font-mono text-xs">
          {activeEngine === "spring" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Stiffness (Tension):</span>
                  <span className="text-[#FF8A00] font-bold">
                    {springStiffness}
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  value={springStiffness}
                  onChange={(e) => setSpringStiffness(Number(e.target.value))}
                  className="w-full accent-[#FF8A00] cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Damping (Friction):</span>
                  <span className="text-cyan-400 font-bold">
                    {springDamping}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={springDamping}
                  onChange={(e) => setSpringDamping(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
              <button
                onClick={triggerAnimation}
                className="w-full bg-[#FF8A00] text-black font-bold py-2.5 rounded-xl hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Play size={14} fill="black" /> Trigger Spring Impulse
              </button>
            </div>
          )}

          {activeEngine === "framer" && (
            <div className="space-y-3">
              <p className="text-slate-300 font-sans leading-relaxed">
                Demonstrates automatic layout morphing (
                <code className="text-[#FF8A00]">layoutId</code>) without manual
                bounding box recalculations.
              </p>
              <button
                onClick={triggerAnimation}
                className="w-full bg-cyan-400 text-black font-bold py-2.5 rounded-xl hover:bg-cyan-300 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <RefreshCw size={14} /> Toggle Layout State
              </button>
            </div>
          )}

          {activeEngine === "tailwind" && (
            <div className="space-y-2 text-slate-300 font-sans">
              <div className="text-[11px] text-slate-400 uppercase font-mono">
                Dynamic Theme Engine:
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                  {/* Interactive Selectors */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Accent Selector */}
                    <div
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${accent.bg} ${accent.text} ${accent.border}`}
                    >
                      <span>Accent:</span>
                      <select
                        value={accent.name}
                        onChange={(e) =>
                          setAccent(
                            ACCENT_OPTIONS.find(
                              (c) => c.name === e.target.value,
                            ) || ACCENT_OPTIONS[0],
                          )
                        }
                        className="bg-transparent border-none outline-none cursor-pointer pr-1 font-bold text-inherit"
                      >
                        {ACCENT_OPTIONS.map((c) => (
                          <option
                            key={c.name}
                            value={c.name}
                            className="bg-slate-900 text-white"
                          >
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Surface Selector */}
                    <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 text-xs font-mono font-bold transition-all">
                      <span>Surface:</span>
                      <select
                        value={surface.name}
                        onChange={(e) =>
                          setSurface(
                            SURFACE_OPTIONS.find(
                              (s) => s.name === e.target.value,
                            ) || SURFACE_OPTIONS[0],
                          )
                        }
                        className="bg-transparent border-none outline-none cursor-pointer pr-1 font-bold text-white"
                      >
                        {SURFACE_OPTIONS.map((s) => (
                          <option
                            key={s.name}
                            value={s.name}
                            className="bg-slate-900 text-white"
                          >
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Live Preview Tab */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">
                      Preview:
                    </span>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${surface.bgClass} ${surface.borderClass}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ backgroundColor: accent.hex }}
                      />
                      <span
                        className={`text-xs font-bold font-mono ${accent.text}`}
                      >
                        Active Tab
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                  Compiled with arbitrary values, fluid typography, and dynamic
                  backdrop-blur matrices.
                </p>
              </div>
            </div>
          )}

          {activeEngine === "radix" && (
            <div className="space-y-3 font-sans text-xs text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
                <Shield size={14} /> WAI-ARIA Compliant Primitives
              </div>
              <p className="text-slate-400 leading-relaxed">
                Accessible keyboard navigation, focus trap rings, and
                zero-runtime unstyled slot architectures.
              </p>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
                &lt;Dialog.Root&gt; &lt;Dialog.Portal&gt;
              </div>
            </div>
          )}
        </div>

        {/* Live Visual Canvas Column */}
        <div className="lg:col-span-7 bg-[#050811] rounded-2xl border border-white/10 p-6 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            GPU RENDER CANVAS
          </div>

          {activeEngine === "spring" && (
            <motion.div
              animate={{
                scale: isTriggered ? 1.35 : 1,
                rotate: isTriggered ? 180 : 0,
                borderRadius: isTriggered ? "50%" : "24px",
              }}
              transition={{
                type: "spring",
                stiffness: springStiffness,
                damping: springDamping,
              }}
              className="w-24 h-24 bg-gradient-to-tr from-[#FF8A00] to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-2xl shadow-orange-500/40 cursor-pointer"
              onClick={triggerAnimation}
            >
              <Atom size={36} />
            </motion.div>
          )}

          {activeEngine === "framer" && (
            <motion.div
              layout
              className={`bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-2xl text-slate-950 font-bold flex items-center gap-3 shadow-xl ${
                isTriggered ? "w-full justify-between" : "w-48 justify-center"
              }`}
            >
              <motion.div
                layout
                className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center text-white"
              >
                <Layout size={18} />
              </motion.div>
              <motion.span layout>
                {isTriggered ? "Expanded Layout Container" : "Compact Node"}
              </motion.span>
            </motion.div>
          )}

          {activeEngine === "tailwind" && (
            <div className="w-full space-y-3">
              <div
                className={`h-3 w-full rounded-full overflow-hidden p-0.5 border border-white/10 ${surface.bgClass} ${surface.borderClass}`}
              >
                <motion.div
                  className={`h-full bg-gradient-to-r ${accent.accent} rounded-full`}
                  animate={{ width: ["20%", "85%", "45%", "100%"] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>0ms JIT</span>
                <span>Optimized Bundle: 3.2 kB</span>
              </div>
            </div>
          )}

          {activeEngine === "radix" && (
            <div className="bg-white/5 border border-white/15 p-4 rounded-2xl w-full max-w-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Keyboard Nav Focus</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  TAB: Active
                </span>
              </div>
              <div className="w-full bg-[#FF8A00]/20 border border-[#FF8A00] p-2 rounded-lg text-center text-xs text-[#FF8A00] font-mono font-bold">
                :focus-visible ring-2
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. FLAGSHIP PROJECT SIMULATORS
// ==========================================

const SaarthiSimulator = () => {
  const [isInferring, setIsInferring] = useState(false);
  const [outputTokens, setOutputTokens] = useState("");
  const [tokensPerSec, setTokensPerSec] = useState(0);
  const [gpuLoad, setGpuLoad] = useState(24);

  const samplePrompt =
    "GET /api/v1/system/saarthi/impact-metrics --target=defense-platform";

  const simulatedResponse = `SAARTHI AI SYSTEM INITIALIZED [PRODUCTION RELEASE < 3 MOS]:
• On-Premise Defense AI Platform: Architected full stack using React (TypeScript), FastAPI, SQL, Docker, and NVIDIA H200 GPUs.
• Enterprise LLM Integration: Automated day-to-day administrative tasks, reducing manual workload by ~50%.
• Air-Gapped Deployment: Configured secure containerized pipelines for repeatable, zero-leakage bare-metal environments.
• DevOps & Delivery: Enforced Git workflows and repository standards, cutting release cycles by 20%.`;

  const runInference = () => {
    if (isInferring) return;
    setIsInferring(true);
    setOutputTokens("");
    setGpuLoad(88);
    setTokensPerSec(142);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= simulatedResponse.length) {
        setOutputTokens(simulatedResponse.slice(0, currentIndex));
        currentIndex += 4;
      } else {
        clearInterval(interval);
        setIsInferring(false);
        setGpuLoad(32);
        setTokensPerSec(0);
      }
    }, 18);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Shield size={16} className="text-[#FF8A00]" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Air-Gapped Node: NVIDIA H200 (80GB VRAM)
          </span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
          SECURE AIR-GAPPED
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-xs">
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="text-slate-400 text-[10px]">GPU UTILIZATION</div>
          <div className="text-[#FF8A00] font-black text-base">{gpuLoad}%</div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
            <motion.div
              className="bg-[#FF8A00] h-full"
              animate={{ width: `${gpuLoad}%` }}
            />
          </div>
        </div>
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="text-slate-400 text-[10px]">INFERENCE SPEED</div>
          <div className="text-cyan-400 font-black text-base">
            {tokensPerSec} t/s
          </div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-full"
              style={{ width: `${(tokensPerSec / 150) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
          <div className="text-slate-400 text-[10px]">VRAM ALLOCATED</div>
          <div className="text-white font-black text-base">42.4 / 80 GB</div>
          <div className="w-full bg-white/10 h-1 rounded-full mt-1.5 overflow-hidden">
            <div className="bg-amber-400 h-full w-[53%]" />
          </div>
        </div>
      </div>

      <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 font-mono text-xs space-y-2">
        <div className="text-slate-400 flex items-center justify-between">
          <span>QUERY ENDPOINT:</span>
          <button
            onClick={runInference}
            disabled={isInferring}
            className="flex items-center gap-1.5 bg-[#FF8A00] text-black px-3 py-1 rounded-md font-bold hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            <Play size={12} fill="black" />{" "}
            {isInferring ? "Streaming Output..." : "Execute Inference"}
          </button>
        </div>
        <p className="text-slate-200 bg-white/5 p-2 rounded-lg border border-white/5">
          {samplePrompt}
        </p>

        <div className="pt-2 border-t border-white/10">
          <div className="text-[#FF8A00] text-[10px] uppercase font-bold mb-1">
            Inference Output Stream:
          </div>
          <pre className="text-slate-200 whitespace-pre-wrap font-sans text-xs min-h-[90px] leading-relaxed">
            {outputTokens || (
              <span className="text-slate-600 font-mono italic">
                Click 'Execute Inference' to query Saarthi architecture and
                project impact data...
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

const CloudLensSimulator = () => {
  const [nodeCount, setNodeCount] = useState(500);

  const legacyHours = Math.round((nodeCount / 500) * 72);
  const optimizedMinutes = Math.round((nodeCount / 500) * 85);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Gauge size={16} className="text-[#FF8A00]" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Multi-Cloud Pricing Optimization Engine
          </span>
        </div>
        <span className="font-mono text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
          40% TIME REDUCTION
        </span>
      </div>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-400">Enterprise Cloud Nodes:</span>
          <span className="text-[#FF8A00] font-bold">
            {nodeCount} Virtual Machines
          </span>
        </div>
        <input
          type="range"
          min="100"
          max="2500"
          step="50"
          value={nodeCount}
          onChange={(e) => setNodeCount(Number(e.target.value))}
          className="w-full accent-[#FF8A00] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>100 Nodes (Startup)</span>
          <span>1250 Nodes (Enterprise)</span>
          <span>2500 Nodes (Hyperscale)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded-xl space-y-1">
          <div className="text-red-400 text-[10px] uppercase font-bold">
            Legacy Batch Pipeline
          </div>
          <div className="text-2xl font-black text-red-200">
            {legacyHours} hrs
          </div>
          <p className="text-[11px] text-red-300/80 font-sans">
            Required manual batch script execution spanning 3+ days.
          </p>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl space-y-1">
          <div className="text-emerald-400 text-[10px] uppercase font-bold">
            Tanvi's Architecture
          </div>
          <div className="text-2xl font-black text-emerald-300">
            {optimizedMinutes} mins
          </div>
          <p className="text-[11px] text-emerald-300/80 font-sans">
            Streamlined cost modeling in Next.js, React & Django.
          </p>
        </div>
      </div>
    </div>
  );
};

const AnalyticsMigrationSimulator = () => {
  const [activeTab, setActiveTab] = useState<"storage" | "quota">("storage");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("storage")}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === "storage"
                ? "bg-[#FF8A00] text-black"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Blue Yonder Migration
          </button>
          <button
            onClick={() => setActiveTab("quota")}
            className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all ${
              activeTab === "quota"
                ? "bg-[#FF8A00] text-black"
                : "bg-white/5 text-slate-400 hover:text-white"
            }`}
          >
            Quota Engine ($17M/yr)
          </button>
        </div>
        <span className="font-mono text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
          ENTERPRISE ROI
        </span>
      </div>

      {activeTab === "storage" ? (
        <div className="grid grid-cols-2 gap-3 font-mono">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">
                Storage Decommissioned
              </div>
              <div className="text-3xl font-black text-white mt-1">2.4 PB</div>
              <div className="text-xs text-emerald-400 mt-1">
                ↓ ~30% Cloud Cost Drop
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-sans mt-3">
              Migrated 150+ data assets across 13 solutions in under 3 months.
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-slate-400 text-[10px] uppercase">
                DevOps Reliability
              </div>
              <div className="text-3xl font-black text-cyan-400 mt-1">40%</div>
              <div className="text-xs text-slate-300 mt-1">
                Faster Issue Turnaround
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-sans mt-3">
              Supervised 90+ analytics products with a 15-member team.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 font-mono space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-300">Quota Allocation Latency:</span>
            <span className="text-emerald-400 font-bold font-mono">
              10 Days → 10 Minutes
            </span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-400 h-full w-[99%]"
              title="Automated Speedup"
            />
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            Automated manual quota allocation with React, Django & SQL,
            unlocking <strong className="text-white">$17M/year</strong> in
            corporate business value.
          </p>
        </div>
      )}
    </div>
  );
};

const MobileAppSimulator = () => {
  const [booked, setBooked] = useState(false);
  const [notification, setNotification] = useState(false);

  const handleBooking = () => {
    setBooked(true);
    setTimeout(() => setNotification(true), 500);
  };

  const handleReset = () => {
    setBooked(false);
    setNotification(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center space-x-2">
          <Smartphone size={16} className="text-[#FF8A00]" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            React Native + FastAPI + Firebase
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-mono"
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      <div className="bg-[#050B16] rounded-2xl p-4 border border-white/10 font-sans relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="text-xs font-black text-[#FF8A00] tracking-wider">
            RUNUP & KALAY APP
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            11:00 AM • 5G
          </div>
        </div>

        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-orange-600 to-amber-500 text-white p-2.5 rounded-xl text-xs flex items-center gap-2 mb-3 shadow-lg"
            >
              <Bell size={14} className="animate-bounce flex-shrink-0" />
              <div>
                <strong className="block text-[11px]">
                  Booking Confirmed!
                </strong>
                <span className="text-[10px] opacity-90">
                  Push notification triggered via Firebase Cloud Messaging.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2.5">
          <div className="bg-white/5 p-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#FF8A00]" />
              <div>
                <div className="text-xs font-bold text-white">
                  Multi-Art & Music Workshop Session
                </div>
                <div className="text-[10px] text-slate-400">
                  Available: 4 Slots • Certified Mentor
                </div>
              </div>
            </div>
            <button
              onClick={handleBooking}
              disabled={booked}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                booked
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-[#FF8A00] text-black hover:bg-amber-400"
              }`}
            >
              {booked ? "Reserved ✓" : "Book Slot"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN APPLICATION
// ==========================================
function MyProfile() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeLabTab, setActiveLabTab] = useState<
    "saarthi" | "cloudlens" | "analytics" | "mobile"
  >("saarthi");

  // Terminal State
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Initialized Tanvi_Tyagi_v6.4 kernel...",
    "Architecture: React 19, FastAPI, NVIDIA H200 AI Pipeline, Docker",
    "System operational. Type 'help' to inspect endpoints.",
  ]);
  const [commandInput, setCommandInput] = useState("");

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
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const section_list = [
    "about",
    "ui-lab",
    "interactive-lab",
    "skills",
    "experience",
    "education",
    "contact",
  ];

  const stats = [
    {
      label: "Years Experience",
      value: "6+",
      icon: <Zap className="text-[#FF8A00]" size={18} />,
    },
    {
      label: "No. of projects",
      value: "10+",
      icon: <Layers className="text-emerald-400" size={18} />,
    },
    {
      label: "Client Stakeholders Aligned",
      value: "Cross-Func",
      icon: <Briefcase className="text-emerald-400" size={18} />,
    },
    {
      label: "Engineers Mentored / Led",
      value: "50+",
      icon: <Users className="text-emerald-400" size={18} />,
    },
  ];

  const skills = {
    "Languages & Core": [
      "Python",
      "TypeScript",
      "JavaScript",
      "SQL",
      "HTML5/CSS3",
    ],
    "Frontend Architecture": [
      "React",
      "Next.js",
      "React Native",
      "Dash",
      "TailwindCSS",
    ],
    "Backend & Distributed APIs": [
      "FastAPI",
      "Django",
      "REST APIs",
      "Celery",
      "Microservices",
    ],
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
      "Air-gapped Deployments",
      "CI/CD Pipelines",
      "Firebase",
    ],
  };

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

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim().toLowerCase();
    let response = "";

    if (cmd === "help") {
      response =
        "Available commands: bio, skills, experience, impact, contact, clear, sudo";
    } else if (cmd === "bio") {
      response =
        "Tanvi Tyagi: Senior Full Stack Engineer (6+ yrs exp) specializing in React, FastAPI, Docker, and Enterprise AI systems.";
    } else if (cmd === "skills") {
      response =
        "Stack: Python, TypeScript, React, Next.js, FastAPI, Docker, Kubernetes, LangChain, RAG.";
    } else if (cmd === "experience") {
      response =
        "Senior SE @ Neuralix.ai -> SE @ Builder.ai -> Analytics Consultant @ MuSigma Inc.";
    } else if (cmd === "impact") {
      response =
        "Key Metrics: 20% compute acceleration, 2+ PB storage saved, $17M/yr corporate value generated.";
    } else if (cmd === "contact") {
      response =
        "Email: tyagitanvi2205@gmail.com | Phone: +91 7000501386 | Location: Noida, India";
    } else if (cmd === "sudo") {
      response = "Root access granted. Engineering superpowers unlocked.";
    } else if (cmd === "clear") {
      setTerminalOutput([]);
      setCommandInput("");
      return;
    } else {
      response = `Command not recognized: '${cmd}'. Type 'help' for available commands.`;
    }

    setTerminalOutput((prev) => [...prev, `> ${commandInput}`, response]);
    setCommandInput("");
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("tyagitanvi2205@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of section_list) {
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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] font-['Nunito_Sans'] text-slate-100 selection:bg-[#FF8A00] selection:text-black overflow-x-hidden relative cursor-default">
      {/* Dynamic Glow Cursor Follower */}
      <motion.div
        className="fixed w-44 h-44 rounded-full bg-[#FF8A00]/10 blur-3xl pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ left: cursorSpringX, top: cursorSpringY }}
      />

      {/* Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF8A00] via-amber-400 to-orange-600 z-[120] origin-left shadow-lg shadow-orange-500/50"
        style={{ scaleX }}
      />

      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-[#FF8A00]/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-[#050811]/80 backdrop-blur-xl border-b border-white/10 z-[100]">
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 items-center">
              {section_list.map((sec) => (
               
                <button
                  key={sec}
                  onClick={() => scrollToSection(sec)}
                  className={`capitalize text-xs lg:text-sm font-bold tracking-wide transition-all relative py-1 ${
                    activeSection === sec
                      ? "text-[#FF8A00]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {sec.replace(/-/g, " ")}
                  {activeSection === sec && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#fff] rounded-full shadow-md shadow-orange-500"
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
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0D1424] border-b border-white/10 px-4 py-4 space-y-2 overflow-hidden"
            >
              {section_list.map((sec) => (
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

      {/* --- HERO SECTION --- */}
      <section
        id="about"
        className="relative pt-32 md:pt-48 pb-20 md:pb-28 px-4 z-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6 text-center md:text-left md:col-span-7 order-2 md:order-1"
          >
            <div className="inline-flex items-center space-x-2 text-[#FF8A00] bg-[#FF8A00]/10 border border-[#FF8A00]/30 font-mono text-xs px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#76e04c] animate-ping" />
              <span>FULL-STACK & ENTERPRISE AI ARCHITECT</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.08] tracking-tight">
              Engineering Resilient <br />
              <span className="bg-gradient-to-r from-[#FF8A00] via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Production Platforms
              </span>{" "}
              <br />
              With Precision.
            </h1>

            <p className="text-base md:text-lg text-slate-300 max-w-xl leading-relaxed">
              Senior Software Engineer with 6+ years of experience delivering
              scalable enterprise AI systems, real-time analytics engines, and
              resilient cloud architectures.
            </p>

            {/* Quick Contacts */}
            <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-slate-400 justify-center md:justify-start pt-2">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
                <MapPin size={15} className="text-[#FF8A00]" /> Noida, India
              </span>
              <button
                onClick={copyEmail}
                className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl hover:border-orange-500/50 transition-all text-slate-200"
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

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
              <MagneticButton>
                <button
                  onClick={() => scrollToSection("ui-lab")}
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

          {/* Avatar Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative md:col-span-5 order-1 md:order-2 flex justify-center items-center"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 aspect-square">
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#FF8A00] via-amber-500 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse" />
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

        {/* Live Metrics Grid with 3D Flip */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {stats.map((st, i) => (
            <TiltCard key={i} className="p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                {st.icon}
              </div>
              <div className="text-2xl md:text-4xl font-black text-white">
                {st.value}
              </div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                {st.label}
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* --- REACT UI & MOTION LAB SECTION --- */}
      <section
        id="ui-lab"
        className="py-20 md:py-24 px-4 bg-slate-900/40 border-y border-white/10 relative z-10"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Interactive React UI Playground
            </h2>
            <p className="text-[#FF8A00] font-bold uppercase tracking-widest text-xs md:text-sm">
              Live Component Physics, Design Systems & Primitives
            </p>
          </div>
          <TiltCard className="p-6 md:p-8">
            <ReactEcosystemPlayground />
          </TiltCard>
        </div>
      </section>

      {/* --- FLAGSHIP INTERACTIVE PROJECT LAB --- */}
      <section
        id="interactive-lab"
        className="py-20 md:py-28 px-4 bg-slate-950/70 border-b border-white/10 relative z-10"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 text-[#FF8A00] bg-[#FF8A00]/10 border border-[#FF8A00]/30 font-mono text-xs px-3.5 py-1.5 rounded-full">
              <Sparkles size={14} /> <span>HANDS-ON SIMULATION LAB</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Interactive Flagship Platforms
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
              Simulate live payloads and query data across the major enterprise
              systems I've delivered.
            </p>
          </div>

          {/* Project Switcher */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              {
                id: "saarthi",
                label: "Saarthi Defense AI",
                icon: <Shield size={16} />,
              },
              {
                id: "cloudlens",
                label: "CloudLens Compute",
                icon: <Gauge size={16} />,
              },
              {
                id: "analytics",
                label: "Blue Yonder & Quota Engine",
                icon: <HardDrive size={16} />,
              },
              {
                id: "mobile",
                label: "RunUp & Kalay Mobile",
                icon: <Smartphone size={16} />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveLabTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs md:text-sm transition-all ${
                  activeLabTab === tab.id
                    ? "bg-[#FF8A00] text-black shadow-lg shadow-orange-500/25 scale-105"
                    : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Simulator Display */}
          <div className="max-w-4xl mx-auto">
            <TiltCard className="p-6 md:p-10 border-orange-500/30">
              {activeLabTab === "saarthi" && <SaarthiSimulator />}
              {activeLabTab === "cloudlens" && <CloudLensSimulator />}
              {activeLabTab === "analytics" && <AnalyticsMigrationSimulator />}
              {activeLabTab === "mobile" && <MobileAppSimulator />}
            </TiltCard>
          </div>
        </div>
      </section>

      {/* --- TECHNICAL ARSENAL --- */}
      <section id="skills" className="py-20 md:py-28 px-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Full-Stack & AI Stack
            </h2>
            <p className="text-[#FF8A00] font-bold uppercase tracking-widest text-xs md:text-sm">
              Built For Performance & Scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <TiltCard key={idx} className="p-6 md:p-8">
                <div className="w-12 h-12 bg-[#FF8A00]/10 border border-[#FF8A00]/20 rounded-2xl flex items-center justify-center text-[#FF8A00] mb-6">
                  {idx === 0 && <Code size={24} />}
                  {idx === 1 && <Layers size={24} />}
                  {idx === 2 && <Cpu size={24} />}
                  {idx === 3 && <Sparkles size={24} />}
                  {idx === 4 && <Cloud size={24} />}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
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

      {/* --- EXPERIENCE TRAJECTORY --- */}
      <section
        id="experience"
        className="py-20 md:py-28 px-4 bg-slate-900/40 border-y border-white/10 relative z-10"
      >
        <div className="max-w-5xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Engineering Experience
            </h2>
            <p className="text-[#FF8A00] font-bold uppercase tracking-widest text-xs md:text-sm">
              End-To-End Delivery & Architecture
            </p>
          </div>

          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <TiltCard key={idx} className="p-6 md:p-8">
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
                    <li key={pIdx} className="flex items-start gap-3">
                      <ChevronRight
                        size={18}
                        className="text-[#FF8A00] flex-shrink-0 mt-1"
                      />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- CYBER TERMINAL SECTION --- */}
      <section className="py-20 md:py-24 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <TiltCard className="p-6 md:p-8 font-mono border-orange-500/30">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-400 font-bold ml-2">
                  tanvi@production-cluster:~ (bash)
                </span>
              </div>
              <Terminal size={16} className="text-[#FF8A00]" />
            </div>

            <div className="space-y-2 text-xs md:text-sm text-slate-300 min-h-[160px] max-h-64 overflow-y-auto pr-2">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith(">")
                      ? "text-[#FF8A00] font-bold"
                      : "text-slate-300"
                  }
                >
                  {line}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleCommand}
              className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2"
            >
              <span className="text-[#FF8A00] font-bold">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                placeholder="Type 'bio', 'skills', 'experience', 'impact', or 'help'..."
                className="bg-transparent border-none text-white focus:outline-none w-full text-xs md:text-sm placeholder:text-slate-600"
              />
              <button
                type="submit"
                className="text-xs bg-[#FF8A00] text-slate-950 font-bold px-3 py-1 rounded-md flex items-center gap-1"
              >
                <span>Exec</span>
                <CornerDownLeft size={12} />
              </button>
            </form>
          </TiltCard>
        </div>
      </section>

      {/* --- EDUCATION --- */}
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
                <p className="text-slate-300 font-medium">
                  Computer Engineering
                </p>
                <p className="text-xs text-[#FF8A00] font-mono font-bold mt-1">
                  Institute of Engineering and Technology, Indore (2015 – 2019)
                </p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section
        id="contact"
        className="py-20 md:py-28 px-4 bg-[#03060E] border-t border-white/10 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-white">
            Let's Engineer The Future
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Open to senior full-stack engineering, system architecture roles,
            and enterprise AI initiatives.
          </p>

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

      {/* --- FOOTER --- */}
      <footer className="bg-[#02040A] text-slate-600 py-8 px-4 border-t border-white/5 text-center text-xs font-mono">
        © 2026 Tanvi Tyagi • Full-Stack & Enterprise AI Engineering.
      </footer>
    </div>
  );
}

export default MyProfile;
