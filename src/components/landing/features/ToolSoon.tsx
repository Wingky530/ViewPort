/**
 * ToolSoonSection — Bento grid for "coming soon" tools.
 *
 * Renders all upcoming tools in a responsive grid (4 cols lg, 2 cols md, 1 col mobile).
 * Each card has a unique tint color (via accentHue from tools.ts) and an animated
 * CSS-only diagram specific to that tool.
 *
 * - ToolSoonSection: Main exported component, renders the full section
 * - SoonCard: Individual card with tinted demo area and entrance animation
 * - Demo*: 8 unique CSS-only animated diagrams (one per tool)
 */
import { useEffect, useRef } from "react";
import type { Tool } from "./tools";

interface SectionProps {
  tools: Tool[];
}

/* ── Per-tool demo diagrams ── */

function DemoInspector() {
  return (
    <div className="diag-inspect">
      <div className="ins-margin">
        <div className="ins-padding">
          <div className="ins-content">
            <svg className="ins-cursor" width="16" height="16" viewBox="0 0 24 24" fill="hsl(var(--card-hue), 80%, 60%)" stroke="white" strokeWidth="2" strokeLinejoin="round">
              <path d="M4 2 L18 13 L11.5 14 L14.5 20 L11.5 21 L8.5 15 L3.5 19 Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoColorPicker() {
  return (
    <div className="diag-picker">
      <div className="dp-spectrum">
        <span className="dp-thumb" />
      </div>
      <div className="dp-hue">
        <span className="dp-slider" />
      </div>
    </div>
  );
}

function DemoBars() {
  return (
    <div className="diag-perf">
      <div className="perf-chart">
        <span className="pc-bar pc-1" />
        <span className="pc-bar pc-2" />
        <span className="pc-bar pc-3" />
        <span className="pc-bar pc-4" />
        <span className="pc-bar pc-5" />
        <span className="pc-bar pc-6" />
        <span className="pc-bar pc-7" />
        <span className="pc-bar pc-8" />
        <span className="pc-bar pc-9" />
      </div>
      <div className="perf-flame">
        <div className="pf-row">
          <span className="pf-block pfb-1" />
        </div>
        <div className="pf-row">
          <span className="pf-block pfb-2" />
          <span className="pf-block pfb-3" />
        </div>
        <div className="pf-row">
          <span className="pf-block pfb-4" />
          <span className="pf-block pfb-5" />
          <span className="pf-block pfb-6" />
        </div>
        <div className="pf-row">
          <span className="pf-block pfb-7" />
          <span className="pf-block pfb-8" />
          <span className="pf-block pfb-9" />
          <span className="pf-block pfb-10" />
        </div>
        <div className="pf-row">
          <span className="pf-block pfb-11" />
          <span className="pf-block pfb-12" />
        </div>
      </div>
    </div>
  );
}

function DemoTree() {
  return (
    <div className="diag-tree">
      <div className="dt-row">
        <span className="dt-arrow">▼</span>
        <span className="dt-tag">&lt;div&gt;</span>
      </div>
      <div className="dt-row dt-indent-1 dt-fade">
        <span className="dt-arrow">▶</span>
        <span className="dt-tag">&lt;span&gt;</span>
        <span className="dt-text">...</span>
        <span className="dt-tag">&lt;/span&gt;</span>
      </div>
      <div className="dt-row dt-indent-1">
        <span className="dt-arrow">▼</span>
        <span className="dt-tag dt-highlight">&lt;p&gt;</span>
      </div>
      <div className="dt-row dt-indent-2">
        <span className="dt-text">Hello</span>
      </div>
      <div className="dt-row dt-indent-1">
        <span className="dt-tag">&lt;/p&gt;</span>
      </div>
      <div className="dt-row">
        <span className="dt-tag">&lt;/div&gt;</span>
      </div>
    </div>
  );
}

function DemoTerminal() {
  return (
    <div className="diag-term">
      <div className="tm-row">
        <span className="tm-prompt">&gt;</span>
        <span className="tm-line tm-1" />
      </div>
      <div className="tm-row tm-log">
        <span className="tm-line tm-2" />
      </div>
      <div className="tm-row tm-err">
        <span className="tm-icon">&times;</span>
        <span className="tm-line tm-3" />
      </div>
      <div className="tm-row">
        <span className="tm-prompt">&gt;</span>
        <span className="tm-cursor" />
      </div>
    </div>
  );
}

function DemoWaterfall() {
  return (
    <div className="diag-waterfall">
      <span className="wf wf-1" />
      <span className="wf wf-2" />
      <span className="wf wf-3" />
      <span className="wf wf-4" />
      <span className="wf wf-5" />
    </div>
  );
}

function DemoCheckmark() {
  return (
    <div className="diag-check">
      <svg viewBox="0 0 40 40" className="check-svg">
        <circle cx="20" cy="20" r="16" className="check-ring" />
        <polyline points="12,21 18,27 28,15" className="check-mark" />
      </svg>
    </div>
  );
}

function DemoGauge() {
  return (
    <div className="diag-gauge">
      <div className="gauge-item">
        <svg viewBox="0 0 32 32" className="gauge-svg">
          <circle cx="16" cy="16" r="14" className="gauge-track" />
          <circle cx="16" cy="16" r="14" className="gauge-fill gf-1" />
        </svg>
        <span className="gauge-val gv-1">98</span>
      </div>
      <div className="gauge-item">
        <svg viewBox="0 0 32 32" className="gauge-svg">
          <circle cx="16" cy="16" r="14" className="gauge-track" />
          <circle cx="16" cy="16" r="14" className="gauge-fill gf-2" />
        </svg>
        <span className="gauge-val gv-2">85</span>
      </div>
      <div className="gauge-item">
        <svg viewBox="0 0 32 32" className="gauge-svg">
          <circle cx="16" cy="16" r="14" className="gauge-track" />
          <circle cx="16" cy="16" r="14" className="gauge-fill gf-3" />
        </svg>
        <span className="gauge-val gv-3">100</span>
      </div>
      <div className="gauge-item">
        <svg viewBox="0 0 32 32" className="gauge-svg">
          <circle cx="16" cy="16" r="14" className="gauge-track" />
          <circle cx="16" cy="16" r="14" className="gauge-fill gf-4" />
        </svg>
        <span className="gauge-val gv-4">92</span>
      </div>
    </div>
  );
}

const DEMO_MAP: Record<string, () => JSX.Element> = {
  "CSS Inspector": DemoInspector,
  "Color Picker": DemoColorPicker,
  "Performance Monitor": DemoBars,
  "DOM Tree Inspector": DemoTree,
  "Console Panel": DemoTerminal,
  "Network Waterfall": DemoWaterfall,
  "Accessibility Audit": DemoCheckmark,
  "Lighthouse Integration": DemoGauge,
};

/* ── Card ── */

function SoonCard({ tool, index }: { tool: Tool; index: number }) {
  const hue = tool.accentHue ?? 0;
  const DemoComponent = DEMO_MAP[tool.name];

  return (
    <div
      className="soon-card"
      style={{
        "--card-hue": hue,
        animationDelay: `${index * 80}ms`,
      } as React.CSSProperties}
    >
      <div className="soon-demo">
        <span className="soon-fig">{String(index + 1).padStart(2, "0")}</span>
        {DemoComponent && <DemoComponent />}
      </div>
      <span className="soon-name">{`> ${tool.name.toUpperCase()}`}</span>
      <p className="soon-desc">{tool.description}</p>
      <div className="soon-foot">
        <span className="soon-badge">SOON</span>
      </div>
    </div>
  );
}

/* ── Section ── */

export function ToolSoonSection({ tools }: SectionProps) {
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
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Section header ── */
        .soon-section-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 8px;
        }
        .soon-stamp {
          font-family: monospace;
          font-size: 11px;
          color: var(--color-text);
        }

        /* ── Card ── */
        .soon-card {
          display: flex;
          flex-direction: column;
          background: color-mix(in srgb, var(--color-bg) 85%, white);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          overflow: hidden;
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .is-visible .soon-card {
          animation: soonCardIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        @keyframes soonCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .soon-card:hover {
          border-color: hsl(var(--card-hue), 30%, 40%);
          transform: translateY(-2px) scale(1.02);
        }

        /* ── Demo area ── */
        .soon-demo {
          height: 140px;
          background: hsl(var(--card-hue), 12%, 13%);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        :root:not(.dark) .soon-demo {
          background: hsl(var(--card-hue), 15%, 93%);
        }
        .soon-card:hover .soon-demo {
          background: hsl(var(--card-hue), 18%, 15%);
        }
        :root:not(.dark) .soon-card:hover .soon-demo {
          background: hsl(var(--card-hue), 22%, 90%);
        }
        .soon-fig {
          position: absolute;
          top: 8px;
          right: 10px;
          font-family: monospace;
          font-size: 10px;
          color: hsl(var(--card-hue), 20%, 45%);
          opacity: 0.6;
        }

        /* ── Card text ── */
        .soon-name {
          display: block;
          font-family: monospace;
          font-size: 11px;
          color: hsl(var(--card-hue), 40%, 60%);
          letter-spacing: 0.05em;
          padding: 12px 14px 4px;
        }
        :root:not(.dark) .soon-name {
          color: hsl(var(--card-hue), 35%, 40%);
        }
        .soon-desc {
          font-size: 12px;
          color: var(--color-text-muted);
          padding: 0 14px;
          margin: 0 0 8px;
          line-height: 1.5;
        }
        .soon-foot {
          margin-top: auto;
          padding: 6px 14px 10px;
          border-top: 1px solid var(--color-border);
        }
        .soon-badge {
          font-family: monospace;
          font-size: 10px;
          color: var(--color-text-dim);
          opacity: 0.6;
          letter-spacing: 0.1em;
        }

        /* ══ Diagrams ══ */

        /* CSS Inspector — Box Model */
        .diag-inspect {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px; height: 70px;
        }
        .ins-margin {
          width: 56px; height: 40px;
          background: color-mix(in srgb, #f97316 20%, transparent);
          border: 1px dashed #f97316;
          display: flex; align-items: center; justify-content: center;
          border-radius: 2px;
          animation: insPulse 4s infinite;
        }
        .ins-padding {
          width: 44px; height: 28px;
          background: color-mix(in srgb, #22c55e 20%, transparent);
          border: 1px dashed #22c55e;
          display: flex; align-items: center; justify-content: center;
          border-radius: 2px;
        }
        .ins-content {
          position: relative;
          width: 28px; height: 16px;
          background: color-mix(in srgb, #3b82f6 30%, transparent);
          border: 1px solid #3b82f6;
          border-radius: 1px;
        }
        .ins-cursor {
          position: absolute;
          top: 50%; left: 50%;
          transform-origin: top left;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.4));
          animation: insCursorMove 4s infinite ease-in-out;
        }
        
        @keyframes insPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes insCursorMove {
          0%, 100% { transform: translate(15px, 15px); opacity: 0; }
          20% { opacity: 1; transform: translate(5px, 5px); }
          40%, 60% { transform: translate(-4px, -4px); opacity: 1; }
          80% { opacity: 0; transform: translate(15px, 15px); }
        }

        /* Color Picker — spectrum and hue slider */
        .diag-picker {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 70px;
        }
        .dp-spectrum {
          position: relative;
          width: 100%;
          height: 48px;
          border-radius: 4px;
          background: linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(var(--card-hue), 80%, 50%));
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
        }
        .dp-thumb {
          position: absolute;
          width: 12px; height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          top: 20%; left: 60%;
          transform: translate(-50%, -50%);
          animation: dpThumbMove 4s ease-in-out infinite;
        }
        .dp-hue {
          position: relative;
          width: 100%;
          height: 10px;
          border-radius: 4px;
          background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
        }
        .dp-slider {
          position: absolute;
          width: 8px; height: 14px;
          border-radius: 2px;
          background: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          top: 50%; left: 30%;
          transform: translate(-50%, -50%);
          animation: dpSliderMove 4s ease-in-out infinite;
        }
        
        @keyframes dpThumbMove {
          0%, 100% { top: 20%; left: 60%; }
          50% { top: 60%; left: 30%; }
        }
        @keyframes dpSliderMove {
          0%, 100% { left: 30%; }
          50% { left: 80%; }
        }

        /* Performance Monitor — flame chart */
        .diag-perf {
          display: flex;
          flex-direction: column;
          width: 80%;
          gap: 6px;
        }
        .perf-chart {
          display: flex;
          align-items: flex-end;
          gap: 1px;
          height: 20px;
          border-bottom: 1px solid hsl(var(--card-hue), 20%, 30%);
        }
        :root:not(.dark) .perf-chart { border-color: hsl(var(--card-hue), 15%, 80%); }
        .pc-bar {
          flex: 1;
          background: hsl(var(--card-hue), 40%, 45%);
          border-radius: 1px 1px 0 0;
          opacity: 0.8;
          transform-origin: bottom;
          animation: pcPulse 3s ease-in-out infinite;
        }
        .pc-1 { height: 30%; animation-delay: 0.1s; }
        .pc-2 { height: 60%; animation-delay: 0.2s; }
        .pc-3 { height: 100%; animation-delay: 0.3s; background: #eab308; }
        .pc-4 { height: 80%; animation-delay: 0.4s; }
        .pc-5 { height: 40%; animation-delay: 0.5s; }
        .pc-6 { height: 50%; animation-delay: 0.6s; }
        .pc-7 { height: 90%; animation-delay: 0.7s; background: #ef4444; }
        .pc-8 { height: 40%; animation-delay: 0.8s; }
        .pc-9 { height: 20%; animation-delay: 0.9s; }
        @keyframes pcPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.6); }
        }
        
        .perf-flame {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .pf-row {
          display: flex;
          gap: 1px;
          height: 3px;
        }
        .pf-block {
          background: hsl(var(--card-hue), 35%, 55%);
          border-radius: 1px;
          opacity: 0.9;
        }
        .pfb-1 { width: 100%; background: hsl(var(--card-hue), 30%, 40%); }
        .pfb-2 { width: 40%; margin-left: 5%; }
        .pfb-3 { width: 30%; margin-left: 10%; background: #eab308; }
        .pfb-4 { width: 15%; margin-left: 5%; }
        .pfb-5 { width: 10%; margin-left: 2%; }
        .pfb-6 { width: 12%; margin-left: 15%; background: #ef4444; }
        .pfb-7 { width: 5%; margin-left: 5%; }
        .pfb-8 { width: 4%; margin-left: 1%; }
        .pfb-9 { width: 3%; margin-left: 3%; }
        .pfb-10 { width: 5%; margin-left: 17%; }
        .pfb-11 { width: 2%; margin-left: 5%; }
        .pfb-12 { width: 2%; margin-left: 20%; }

        /* DOM Tree — DevTools elements style */
        .diag-tree {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 85%;
          font-family: monospace;
          font-size: 10px;
          line-height: 1.4;
          font-weight: bold;
        }
        .dt-row {
          display: flex;
          align-items: center;
          white-space: nowrap;
        }
        .dt-indent-1 { margin-left: 10px; }
        .dt-indent-2 { margin-left: 20px; }
        .dt-arrow {
          display: inline-block;
          font-size: 6px;
          width: 10px;
          color: hsl(var(--card-hue), 20%, 40%);
          transform: translateY(-1px);
        }
        .dt-tag {
          color: hsl(var(--card-hue), 50%, 60%);
        }
        :root:not(.dark) .dt-tag {
          color: hsl(var(--card-hue), 60%, 45%);
        }
        .dt-text {
          color: var(--color-text-muted);
          margin: 0 4px;
          font-weight: normal;
        }
        .dt-highlight {
          background: color-mix(in srgb, var(--color-accent) 20%, transparent);
          color: var(--color-accent);
          border-radius: 2px;
          padding: 0 2px;
          animation: dtFlash 4s infinite;
        }
        .dt-fade {
          opacity: 0.6;
        }
        @keyframes dtFlash {
          0%, 50%, 100% { background: transparent; }
          25%, 75% { background: color-mix(in srgb, var(--color-accent) 20%, transparent); }
        }

        /* Console — web devtools style */
        .diag-term {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: flex-start;
          width: 80%;
          font-family: monospace;
          font-size: 10px;
          font-weight: bold;
        }
        .tm-row {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
        }
        .tm-prompt {
          color: hsl(var(--card-hue), 40%, 55%);
        }
        .tm-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #ef4444;
          color: white;
          font-size: 8px;
          line-height: 1;
        }
        .tm-line {
          height: 4px;
          border-radius: 2px;
          background: hsl(var(--card-hue), 20%, 50%);
          opacity: 0;
        }
        .tm-err {
          background: color-mix(in srgb, #ef4444 10%, transparent);
          padding: 2px 4px;
          margin-left: -4px;
          border-radius: 2px;
          border-left: 2px solid #ef4444;
        }
        .tm-err .tm-line { background: #ef4444; }
        
        .tm-1 { width: 40px; animation: tmType1 5s infinite; }
        .tm-2 { width: 30px; animation: tmType2 5s infinite; }
        .tm-3 { width: 60px; animation: tmType3 5s infinite; }
        .tm-cursor {
          width: 6px; height: 12px;
          background: hsl(var(--card-hue), 45%, 55%);
          animation: tmBlink 0.8s step-end infinite;
        }
        
        @keyframes tmType1 {
          0%, 10% { opacity: 0; width: 0; }
          15%, 90% { opacity: 0.8; width: 40px; }
          100% { opacity: 0; width: 0; }
        }
        @keyframes tmType2 {
          0%, 25% { opacity: 0; width: 0; }
          30%, 90% { opacity: 0.6; width: 30px; }
          100% { opacity: 0; width: 0; }
        }
        @keyframes tmType3 {
          0%, 40% { opacity: 0; width: 0; }
          45%, 90% { opacity: 0.8; width: 60px; }
          100% { opacity: 0; width: 0; }
        }
        @keyframes tmBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* Network Waterfall — cascading bars */
        .diag-waterfall {
          display: flex;
          flex-direction: column;
          gap: 4px;
          width: 60px;
        }
        .wf {
          height: 5px;
          border-radius: 1px;
          background: hsl(var(--card-hue), 35%, 50%);
          transform-origin: left;
        }
        .wf-1 { width: 12px; margin-left: 0; animation: wfFill 3.5s ease-out infinite; }
        .wf-2 { width: 20px; margin-left: 8px; animation: wfFill 3.5s ease-out infinite 0.3s; }
        .wf-3 { width: 16px; margin-left: 22px; animation: wfFill 3.5s ease-out infinite 0.6s; }
        .wf-4 { width: 24px; margin-left: 28px; animation: wfFill 3.5s ease-out infinite 0.9s; }
        .wf-5 { width: 10px; margin-left: 48px; animation: wfFill 3.5s ease-out infinite 1.2s; }
        @keyframes wfFill {
          0% { transform: scaleX(0); opacity: 0; }
          20% { transform: scaleX(1); opacity: 0.9; }
          60%, 100% { transform: scaleX(1); opacity: 0.2; }
        }

        /* Accessibility — checkmark */
        .diag-check {
          width: 40px; height: 40px;
        }
        .check-svg {
          width: 100%; height: 100%;
        }
        .check-ring {
          fill: none;
          stroke: hsl(var(--card-hue), 30%, 45%);
          stroke-width: 2;
          opacity: 0.4;
        }
        .check-mark {
          fill: none;
          stroke: hsl(var(--card-hue), 50%, 55%);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: drawCheck 3s ease-in-out infinite;
        }
        @keyframes drawCheck {
          0%, 30% { stroke-dashoffset: 30; }
          60%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 30; }
        }

        /* Lighthouse — 4 gauges */
        .diag-gauge {
          display: flex;
          gap: 8px;
        }
        .gauge-item {
          position: relative;
          width: 32px; height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gauge-svg {
          position: absolute;
          width: 100%; height: 100%;
          transform: rotate(-90deg);
        }
        .gauge-track {
          fill: none;
          stroke: hsl(var(--card-hue), 15%, 25%);
          stroke-width: 2.5;
        }
        :root:not(.dark) .gauge-track {
          stroke: hsl(var(--card-hue), 15%, 85%);
        }
        .gauge-fill {
          fill: none;
          stroke: hsl(var(--card-hue), 50%, 55%);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-dasharray: 88;
          stroke-dashoffset: 88;
        }
        .gf-1 { animation: gaugeFill1 3.5s ease-in-out infinite; }
        .gf-2 { animation: gaugeFill2 3.5s ease-in-out infinite 0.1s; }
        .gf-3 { animation: gaugeFill3 3.5s ease-in-out infinite 0.2s; }
        .gf-4 { animation: gaugeFill4 3.5s ease-in-out infinite 0.3s; }
        
        @keyframes gaugeFill1 {
          0% { stroke-dashoffset: 88; }
          40%, 70% { stroke-dashoffset: 2; } /* 98 */
          100% { stroke-dashoffset: 88; }
        }
        @keyframes gaugeFill2 {
          0% { stroke-dashoffset: 88; }
          40%, 70% { stroke-dashoffset: 13; } /* 85 */
          100% { stroke-dashoffset: 88; }
        }
        @keyframes gaugeFill3 {
          0% { stroke-dashoffset: 88; }
          40%, 70% { stroke-dashoffset: 0; } /* 100 */
          100% { stroke-dashoffset: 88; }
        }
        @keyframes gaugeFill4 {
          0% { stroke-dashoffset: 88; }
          40%, 70% { stroke-dashoffset: 7; } /* 92 */
          100% { stroke-dashoffset: 88; }
        }
        .gauge-val {
          font-family: monospace;
          font-size: 9px;
          font-weight: 700;
          color: hsl(var(--card-hue), 40%, 55%);
        }
        .gv-1 { animation: gaugeNum 3.5s ease-in-out infinite; }
        .gv-2 { animation: gaugeNum 3.5s ease-in-out infinite 0.1s; }
        .gv-3 { animation: gaugeNum 3.5s ease-in-out infinite 0.2s; }
        .gv-4 { animation: gaugeNum 3.5s ease-in-out infinite 0.3s; }
        @keyframes gaugeNum {
          0%, 20% { opacity: 0; }
          40%, 70% { opacity: 1; }
          90%, 100% { opacity: 0; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .soon-card {
            opacity: 1;
            transform: none;
            animation: none !important;
          }
          .ins-margin, .ins-cursor, .dp-thumb, .dp-slider, .pc-bar, .dt-highlight, .tm-line, .tm-cursor,
          .wf, .check-mark, .gauge-fill, .gauge-val {
            animation: none !important;
          }
          .ins-margin { transform: scale(1); }
          .ins-cursor { transform: translate(0, 0); opacity: 1; }
          .dp-thumb, .dp-slider { transform: translate(-50%, -50%) !important; }
          .pc-bar { transform: scaleY(0.8); }
          .dt-highlight { background: color-mix(in srgb, var(--color-accent) 20%, transparent); }
          .tm-line { opacity: 0.6; }
          .tm-cursor { opacity: 1; }
          .wf { transform: scaleX(0.7); opacity: 0.5; }
          .check-mark { stroke-dashoffset: 0; }
          .gauge-fill { stroke-dashoffset: 10; }
          .gauge-val { opacity: 1; }
        }
      `}</style>

      <section ref={sectionRef} className="pt-24 px-6" id="tools-coming-soon">
        <div className="mx-auto max-w-[800px] mb-8">
          <div className="soon-section-head">
            <span className="soon-stamp">02</span>
            <span className="text-[10px] font-mono font-semibold text-text-muted">&gt; Coming up</span>
          </div>
          <h2 className="text-[clamp(1.5rem,3.5vw,2rem)] font-black italic text-text leading-[1.1] tracking-tight mb-2">
            Coming soon<span className="text-accent">.</span>
          </h2>
          <p className="text-xs text-text-muted max-w-lg">
            Eight more tools in development. Each one designed to live inside ViewPort — no browser DevTools tab-switching.
          </p>
        </div>

        <div className="mx-auto max-w-[800px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, i) => (
              <SoonCard key={tool.name} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** @deprecated Use ToolSoonSection instead */
export default function ToolSoon({ tool }: { tool: Tool }) {
  return <ToolSoonSection tools={[tool]} />;
}
