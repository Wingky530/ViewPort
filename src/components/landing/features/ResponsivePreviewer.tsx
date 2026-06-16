/**
 * ResponsivePreviewer — Feature showcase for the "Responsive Preview" tool.
 *
 * Renders feature cards in a bento grid with unique per-card tint colors and
 * polished CSS keyframe animations for each demo diagram.
 *
 * Components:
 * - ResponsivePreviewer: Main section wrapper with IntersectionObserver reveal
 * - Card: Individual feature card with tinted demo area
 * - DemoMultipleDevices: Three device frames cycling with lift effect
 * - DemoCustomSize: Resizing frame with dimension labels and border flash
 * - DemoRotate: Phone rotating with overshoot settle
 * - DemoScreenshot: Flash + crosshair + bouncing thumbnail
 * - DemoHistory: URL list with sliding highlight bar
 */
import { useEffect, useRef } from "react";
import type { Tool } from "./tools";

interface Props {
  tool: Tool;
}

const CARD_HUES: Record<string, number> = {
  "fig-01": 350,
  "fig-02": 210,
  "fig-03": 160,
  "fig-04": 45,
  "fig-05": 280,
};

function Card({ feature, index }: { feature: NonNullable<Tool["features"]>[number]; index: number }) {
  const hue = CARD_HUES[feature.id] ?? 0;
  return (
    <div
      className={`feature-card ${feature.spanFull ? "md:col-span-2" : ""}`}
      style={{
        "--card-hue": hue,
        animationDelay: `${index * 150}ms`,
      } as React.CSSProperties}
    >
      <div className="demo-area">
        <span className="fig-label">{feature.id.toUpperCase()}</span>
        {feature.id === "fig-01" && <DemoMultipleDevices />}
        {feature.id === "fig-02" && <DemoCustomSize />}
        {feature.id === "fig-03" && <DemoRotate />}
        {feature.id === "fig-04" && <DemoScreenshot />}
        {feature.id === "fig-05" && <DemoHistory />}
      </div>
      <span className="feature-label">{`> ${feature.label}`}</span>
      <p className="feature-desc">{feature.description}</p>
      <code className="code-snippet">{feature.snippet}</code>
    </div>
  );
}

function DemoMultipleDevices() {
  return (
    <div className="demo-fig1">
      <div className="dev dev-3">
        <div className="bar" />
        <div className="body" />
        <div className="stand" />
      </div>
      <div className="dev dev-2">
        <div className="body" />
      </div>
      <div className="dev dev-1">
        <div className="body" />
      </div>
    </div>
  );
}

function DemoCustomSize() {
  return (
    <div className="demo-fig2">
      <div className="resize-dims">
        <span className="dim dim-1">375 × 812</span>
        <span className="dim dim-2">1024 × 768</span>
        <span className="dim dim-3">1920 × 1080</span>
      </div>
      <div className="resize-frame">
        <div className="bar" />
        <div className="body" />
      </div>
    </div>
  );
}

function DemoRotate() {
  return (
    <div className="demo-fig3">
      <div className="or-label or-portrait">PORTRAIT</div>
      <div className="or-label or-landscape">LANDSCAPE</div>
      <div className="or-phone">
        <div className="or-screen" />
      </div>
    </div>
  );
}

function DemoScreenshot() {
  return (
    <div className="demo-fig4">
      <div className="ss-frame">
        <div className="bar" />
        <div className="body" />
      </div>
      <div className="ss-flash" />
      <div className="ss-thumb">
        <div className="ss-thumb-bar" />
        <div className="ss-thumb-body" />
      </div>
    </div>
  );
}

function DemoHistory() {
  const ClockIcon = () => (
    <svg className="h-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  return (
    <div className="demo-fig5">
      <div className="h-list">
        <div className="h-highlight" />
        <div className="h-item hi-1">
          <ClockIcon />localhost:3000/dashboard
        </div>
        <div className="h-item hi-2">
          <ClockIcon />motion.dev/features
        </div>
        <div className="h-item hi-3">
          <ClockIcon />192.168.1.5:5173
        </div>
      </div>
    </div>
  );
}

export default function ResponsivePreviewer({ tool }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .feature-card {
          display: flex;
          flex-direction: column;
          background: color-mix(in srgb, var(--color-bg) 85%, white);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition: border-color 0.25s ease, transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s ease;
        }
        .feature-card:hover {
          border-color: hsl(var(--card-hue), 30%, 45%);
          transform: translateY(-2px);
          background: color-mix(in srgb, var(--color-bg) 75%, white);
        }
        .is-visible .feature-card {
          animation: cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .demo-area {
          height: 160px;
          background: hsl(var(--card-hue), 12%, 13%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s ease;
        }
        :root:not(.dark) .demo-area {
          background: hsl(var(--card-hue), 15%, 93%);
        }
        .feature-card:hover .demo-area {
          background: hsl(var(--card-hue), 16%, 15%);
        }
        :root:not(.dark) .feature-card:hover .demo-area {
          background: hsl(var(--card-hue), 20%, 90%);
        }
        .fig-label {
          position: absolute;
          top: 8px;
          right: 10px;
          font-size: 10px;
          font-family: monospace;
          color: hsl(var(--card-hue), 20%, 45%);
          opacity: 0.55;
          z-index: 10;
        }
        .feature-label {
          display: block;
          font-family: monospace;
          font-size: 11px;
          color: hsl(var(--card-hue), 40%, 60%);
          letter-spacing: 0.05em;
          padding: 12px 14px 4px;
        }
        :root:not(.dark) .feature-label {
          color: hsl(var(--card-hue), 35%, 40%);
        }
        .feature-desc {
          font-size: 12px;
          color: var(--color-text-muted);
          padding: 0 14px;
          margin: 0 0 8px;
          line-height: 1.5;
        }
        .code-snippet {
          display: block;
          font-family: monospace;
          font-size: 11px;
          margin-top: auto;
          background: color-mix(in srgb, var(--color-bg) 70%, black);
          color: var(--color-text-dim);
          padding: 6px 14px 10px;
          border-top: 1px solid var(--color-border);
        }
        :root:not(.dark) .code-snippet {
          background: color-mix(in srgb, var(--color-bg) 92%, black);
        }

        /* ── Section header ── */
        .rp-section-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }
        .rp-stamp {
          font-family: monospace;
          font-size: 11px;
          color: var(--color-text-dim);
          opacity: 0.4;
        }

        /* -- shared frame -- */
        .bar {
          height: 8px;
          background: color-mix(in srgb, var(--color-bg) 55%, white);
          border-bottom: 1px solid var(--color-border);
        }
        .body {
          flex: 1;
          margin: 3px;
          border-radius: 2px;
          background: color-mix(in srgb, var(--color-bg) 30%, white);
        }

        /* ── FIG.01: Multiple Devices ── */
        .demo-fig1 {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dev {
          position: absolute;
          display: flex;
          flex-direction: column;
          background: color-mix(in srgb, var(--color-bg) 50%, white);
          border: 1px solid var(--color-border);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .dev-1 {
          width: 26px; height: 52px;
          border-radius: 6px;
          justify-content: center;
          align-items: center;
          animation: dev1Cycle 9s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        .dev-1 .body {
          width: calc(100% - 4px); height: calc(100% - 4px);
          margin: 0; border-radius: 4px;
        }

        .dev-2 {
          width: 44px; height: 56px;
          border-radius: 6px;
          justify-content: center;
          align-items: center;
          animation: dev2Cycle 9s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        .dev-2 .body {
          width: calc(100% - 6px); height: calc(100% - 6px);
          margin: 0; border-radius: 3px;
        }

        .dev-3 {
          width: 80px; height: 52px;
          border-radius: 4px 4px 0 0;
          justify-content: flex-start;
          border-bottom-width: 4px;
          animation: dev3Cycle 9s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        .dev-3 .bar { height: 6px; border-bottom: 1px solid var(--color-border); width: 100%; }
        .dev-3 .body { flex: 1; margin: 0; border-radius: 0; width: 100%; }
        .dev-3 .stand {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 4px;
          background: var(--color-border);
          border-radius: 0 0 2px 2px;
        }

        @keyframes dev1Cycle {
          0%, 25%  { transform: scale(1) translateX(20px) translateY(10px); opacity: 1; }
          30%, 95% { transform: scale(0.85) translateX(20px) translateY(15px); opacity: 0.4; }
          100%     { transform: scale(1) translateX(20px) translateY(10px); opacity: 1; }
        }
        @keyframes dev2Cycle {
          0%, 28%  { transform: scale(0.85) translateX(0px) translateY(0px); opacity: 0.4; }
          33%, 58% { transform: scale(1) translateX(0px) translateY(-5px); opacity: 1; }
          63%, 95% { transform: scale(0.85) translateX(0px) translateY(0px); opacity: 0.4; }
          100%     { transform: scale(0.85) translateX(0px) translateY(0px); opacity: 0.4; }
        }
        @keyframes dev3Cycle {
          0%, 61%  { transform: scale(0.85) translateX(-20px) translateY(-10px); opacity: 0.4; }
          66%, 91% { transform: scale(1) translateX(-20px) translateY(-15px); opacity: 1; }
          95%, 100% { transform: scale(0.85) translateX(-20px) translateY(-10px); opacity: 0.4; }
        }

        /* ── FIG.02: Custom Size ── */
        .demo-fig2 {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .resize-dims {
          position: relative;
          height: 14px;
          width: 100%;
          text-align: center;
        }
        .dim {
          position: absolute;
          left: 50%;
          font-family: monospace;
          font-size: 10px;
          color: var(--color-text);
          opacity: 0;
        }
        .dim-1 { animation: dimShow 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .dim-2 { animation: dimShow 9s cubic-bezier(0.16,1,0.3,1) infinite; animation-delay: 3s; }
        .dim-3 { animation: dimShow 9s cubic-bezier(0.16,1,0.3,1) infinite; animation-delay: 6s; }
        @keyframes dimShow {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.85); }
          8%   { opacity: 1; transform: translateX(-50%) scale(1.05); }
          12%, 22% { opacity: 1; transform: translateX(-50%) scale(1); }
          30%, 100% { opacity: 0; transform: translateX(-50%) scale(0.9); }
        }
        .resize-frame {
          display: flex;
          flex-direction: column;
          border-radius: 6px;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-bg) 50%, white);
          border: 1px solid var(--color-border);
          animation: resizeDim 9s cubic-bezier(0.16,1,0.3,1) infinite;
        }
        @keyframes resizeDim {
          0%, 22%  { width: 50px; height: 65px; border-color: var(--color-border); }
          27%      { border-color: var(--color-accent); }
          30%, 52% { width: 80px; height: 50px; border-color: var(--color-border); }
          57%      { border-color: var(--color-accent); }
          60%, 82% { width: 110px; height: 42px; border-color: var(--color-border); }
          87%      { border-color: var(--color-accent); }
          100%     { width: 50px; height: 65px; border-color: var(--color-border); }
        }
        .resize-frame { will-change: width, height, border-color; }
        .resize-frame .body { height: 18px; }

        /* ── FIG.03: Rotate ── */
        .demo-fig3 {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .or-phone {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 70px;
          border-radius: 6px;
          background: color-mix(in srgb, var(--color-bg) 50%, white);
          border: 2px solid var(--color-border);
          box-shadow: 2px 4px 12px rgba(0,0,0,0.1);
          animation: phoneSpin 9s cubic-bezier(0.16,1,0.3,1) infinite;
          will-change: transform;
        }
        .or-screen {
          width: 28px;
          height: 58px;
          border-radius: 2px;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
        }
        @keyframes phoneSpin {
          0%, 25%  { transform: rotate(0deg); }
          32%      { transform: rotate(95deg); }
          35%, 60% { transform: rotate(90deg); }
          67%      { transform: rotate(-5deg); }
          70%, 100% { transform: rotate(0deg); }
        }
        .or-label {
          position: absolute;
          font-family: monospace;
          font-size: 9px;
          color: var(--color-text-dim);
          letter-spacing: 0.1em;
          opacity: 0;
        }
        .or-portrait {
          right: 20px;
          animation: labelShow 9s infinite;
        }
        .or-landscape {
          right: 20px;
          animation: labelShow 9s infinite;
          animation-delay: 3s;
        }
        @keyframes labelShow {
          0%, 22% { opacity: 1; }
          30%, 100% { opacity: 0; }
        }

        /* ── FIG.04: Screenshot ── */
        .demo-fig4 {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ss-frame {
          display: flex;
          flex-direction: column;
          width: 80px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-bg) 50%, white);
          border: 1px solid var(--color-border);
          animation: ssFrameBorder 6s ease-in-out infinite;
        }
        @keyframes ssFrameBorder {
          0%, 18% { border-color: var(--color-border); }
          20%, 22% { border-color: var(--color-accent); }
          26%, 100% { border-color: var(--color-border); }
        }
        .ss-frame .body { height: 20px; }
        .ss-flash {
          position: absolute;
          inset: 0;
          background: white;
          opacity: 0;
          pointer-events: none;
          animation: shutterFlash 6s ease-in-out infinite;
        }
        @keyframes shutterFlash {
          0%, 18% { opacity: 0; }
          19%     { opacity: 0.9; }
          21%     { opacity: 0.6; }
          23%     { opacity: 0.1; }
          25%, 100% { opacity: 0; }
        }
        .ss-thumb {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 32px;
          height: 24px;
          border-radius: 4px;
          overflow: hidden;
          background: color-mix(in srgb, var(--color-bg) 50%, white);
          border: 1px solid var(--color-border);
          opacity: 0;
          transform: translateY(12px) scale(0.6);
        }
        .ss-thumb .ss-thumb-bar { 
          height: 8px;
          background: color-mix(in srgb, var(--color-bg) 55%, white);
          border-bottom: 1px solid var(--color-border);
        }
        .ss-thumb-body {
          flex: 1;
          margin: 2px;
          border-radius: 1px;
          background: color-mix(in srgb, var(--color-bg) 20%, white);
        }
        @keyframes thumbAppear {
          0%, 25% { opacity: 0; transform: translateY(12px) scale(0.6); }
          32%     { opacity: 1; transform: translateY(-3px) scale(1.05); }
          36%, 100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ss-thumb { animation: thumbAppear 6s cubic-bezier(0.22,1,0.36,1) infinite; }

        /* ── FIG.05: History ── */
        .demo-fig5 {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .h-list {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          font-family: monospace;
          font-size: 10px;
          position: relative;
          z-index: 1;
        }
        .h-item {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--color-text-dim);
          opacity: 0.3;
          height: 18px;
          padding: 0 6px;
          border-radius: 4px;
        }
        .h-icon {
          color: var(--color-accent);
          opacity: 0;
          transform: scale(0.5);
        }
        .h-highlight {
          position: absolute;
          left: -4px;
          top: 0;
          width: 181px;
          height: 18px;
          border-radius: 4px;
          background: color-mix(in srgb, var(--color-accent) 8%, transparent);
          animation: hlSlide 9s cubic-bezier(0.16,1,0.3,1) infinite;
          z-index: 1;
        }
        @keyframes hlSlide {
          0%, 25%  { transform: translateY(0px); width: 181px; }
          33%, 58% { transform: translateY(21px); width: 151px; }
          66%, 91% { transform: translateY(42px); width: 133px; }
          100%     { transform: translateY(0px); width: 181px; }
        }

        @keyframes hist1 {
          0%, 25% { opacity: 1; color: var(--color-text); transform: translateX(4px); }
          30%, 100% { opacity: 0.3; color: var(--color-text-dim); transform: translateX(0); }
        }
        @keyframes hist1Arr {
          0%, 25% { opacity: 1; transform: scale(1); }
          30%, 100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes hist2 {
          0%, 28% { opacity: 0.3; color: var(--color-text-dim); transform: translateX(0); }
          33%, 58% { opacity: 1; color: var(--color-text); transform: translateX(4px); }
          63%, 100% { opacity: 0.3; color: var(--color-text-dim); transform: translateX(0); }
        }
        @keyframes hist2Arr {
          0%, 28% { opacity: 0; transform: scale(0.5); }
          33%, 58% { opacity: 1; transform: scale(1); }
          63%, 100% { opacity: 0; transform: scale(0.5); }
        }
        @keyframes hist3 {
          0%, 61% { opacity: 0.3; color: var(--color-text-dim); transform: translateX(0); }
          66%, 91% { opacity: 1; color: var(--color-text); transform: translateX(4px); }
          95%, 100% { opacity: 0.3; color: var(--color-text-dim); transform: translateX(0); }
        }
        @keyframes hist3Arr {
          0%, 61% { opacity: 0; transform: scale(0.5); }
          66%, 91% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0.5); }
        }
        .hi-1 { animation: hist1 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .hi-1 .h-icon { animation: hist1Arr 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .hi-2 { animation: hist2 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .hi-2 .h-icon { animation: hist2Arr 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .hi-3 { animation: hist3 9s cubic-bezier(0.16,1,0.3,1) infinite; }
        .hi-3 .h-icon { animation: hist3Arr 9s cubic-bezier(0.16,1,0.3,1) infinite; }

        /* -- reduced motion -- */
        @media (prefers-reduced-motion: reduce) {
          .feature-card {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .dev, .resize-frame, .or-phone, .ss-flash, .ss-thumb,
          .h-item, .dim, .or-label, .h-icon, .h-highlight {
            animation: none !important;
          }
          .dev { opacity: 0.5 !important; }
          .dev-1 { transform: scale(1) translateX(0) !important; opacity: 1 !important; }
          .dev-2 { transform: scale(0.8) translateX(-5px) !important; opacity: 0.5 !important; }
          .dev-3 { transform: scale(0.7) translateX(0) !important; opacity: 0.5 !important; }
          .resize-frame { width: 80px !important; height: 50px !important; }
          .dim-1 { opacity: 1 !important; transform: translateX(-50%) !important; }
          .dim-2, .dim-3 { opacity: 0 !important; }
          .or-label { opacity: 0 !important; }
          .ss-flash { opacity: 0 !important; }
          .ss-thumb { opacity: 0 !important; }
          .h-item { opacity: 0.3 !important; transform: none !important; }
          .hi-1 { opacity: 1 !important; color: var(--color-text) !important; }
          .h-highlight { display: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="pt-24 px-6"
        id="tool-responsive-preview"
      >
        <div className="mx-auto max-w-[800px] mb-8">
          <div className="rp-section-head">
            <span className="rp-stamp">01</span>
            <span className="text-[10px] font-mono text-text-dim opacity-50">&gt; Available now</span>
          </div>
          <a
            href={tool.href ?? "/app"}
            className="group inline-flex items-center gap-3 no-underline mb-2"
          >
            <h2 className="text-[clamp(1.5rem,3.5vw,2rem)] font-black italic text-text leading-[1.1] tracking-tight group-hover:text-accent transition-colors duration-200">
              {tool.name}
              <span className="text-accent">.</span>
            </h2>
            <span className="text-[10px] font-medium uppercase tracking-widest whitespace-nowrap rounded-sm px-1.5 py-0.5 text-accent bg-accent/10 border border-accent/30">
              Available
            </span>
          </a>
          <p className="text-xs text-text-muted max-w-lg">{tool.description}</p>
        </div>

        <div className="mx-auto max-w-[800px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tool.features?.map((f, i) => (
              <Card key={f.id} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
