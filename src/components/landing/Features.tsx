import { useState, useEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";

const BG = "var(--color-bg)";
const CARD_BG = "var(--color-surface)";
const CREAM = "var(--color-text)";
const ACCENT = "var(--color-accent)";
const MUTED = "var(--color-text-muted)";
const BORDER = "var(--color-border)";
const BORDER_HOVER = "var(--color-surface-hover)";
const BORDER_ACCENT = "var(--color-accent)";

const horizBg = [
  "repeating-linear-gradient(rgba(37,36,34,0.07) 0px, rgba(37,36,34,0.07) 1px, transparent 1px, transparent 40px)",
  "repeating-linear-gradient(rgba(37,36,34,0.13) 0px, rgba(37,36,34,0.13) 2px, transparent 2px, transparent 200px)",
].join(", ");
const vertBg = [
  "repeating-linear-gradient(90deg, rgba(37,36,34,0.07) 0px, rgba(37,36,34,0.07) 1px, transparent 1px, transparent 40px)",
  "repeating-linear-gradient(90deg, rgba(37,36,34,0.13) 0px, rgba(37,36,34,0.13) 2px, transparent 2px, transparent 200px)",
].join(", ");

const features = [
  { name: "Responsive Preview", short: "Sandboxed iframe with local URL proxy, device presets, zoom, rotate, and URL history.", long: "Display any URL inside a sandboxed iframe. Local URL Proxy strips blocking headers for localhost preview. Device presets include mobile, tablet, desktop & TV viewports with realistic bezels. Freely resize with drag handles, scale and flip portrait/landscape, and browse recent URLs from local storage.", status: "available" },
  { name: "CSS Inspector", short: "Hover to highlight, click to inspect. Computed styles, box model, and live editing.", long: "Hover to highlight elements, click to inspect them. View all computed CSS properties, visualize margin/padding/border/content box model dimensions, debug Flexbox & Grid layouts visually, and modify styles live to see changes instantly.", status: "soon" },
  { name: "Color Picker", short: "Extract colors from any element. HEX, RGB, HSL formats with one-click copy.", long: "Click any element to extract its color. View colors in HEX, RGB, or HSL formats. Auto-extract dominant colors from the page with palette generator and copy any color code with a single click.", status: "soon" },
  { name: "Performance Monitor", short: "Real-time Core Web Vitals, FPS counter, network timeline, and memory usage.", long: "Measure FCP, LCP, and CLS in real-time. Monitor rendering with an FPS counter, view request waterfall with latency breakdowns, and track heap size and garbage collection cycles.", status: "soon" },
  { name: "DOM Tree Inspector", short: "Interactive DOM tree with attribute editing, event listeners, and element search.", long: "Expand and collapse the element hierarchy interactively. Click elements or navigate the tree to inspect, edit HTML attributes live, view attached event handlers, and find elements by tag, class, or ID.", status: "soon" },
  { name: "Console Panel", short: "Execute JS in iframe context. Logs, warnings, and errors with syntax highlighting.", long: "Run JavaScript directly in the iframe's context. View console logs, warnings, and errors. Catch and display runtime errors with formatted syntax-highlighted output for better readability.", status: "soon" },
  { name: "Network Waterfall", short: "Visualize requests with timing. Headers, response body, and bottleneck detection.", long: "Visualize all network requests with precise timing. View headers, response body, status codes, and sizes. Identify slow requests and bottlenecks, and filter or search by type or name.", status: "soon" },
  { name: "Accessibility Audit", short: "WCAG compliance, contrast ratios, ARIA validation, and detailed audit reports.", long: "Check for WCAG 2.1 violations, verify text contrast ratios, detect missing or incorrect ARIA attributes, and ensure proper semantic HTML usage. Generate detailed accessibility reports with actionable fixes.", status: "soon" },
  { name: "Lighthouse Integration", short: "Performance, SEO, best practices, and accessibility scores. Mobile vs Desktop.", long: "Get Google Lighthouse performance metrics, check SEO best practices, identify common web development issues, and run automated accessibility analysis. Compare mobile vs desktop audits with detailed scoring breakdown and recommendations.", status: "soon" },
];

interface Feature {
  name: string;
  short: string;
  long: string;
  status: string;
}

function FeatureCard({ feature, index, isActive, onClick }: { feature: Feature; index: number; isActive: boolean; onClick: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (isActive) {
      setPanelVisible(true);
      panel.style.visibility = "visible";
      panel.style.transform = "translateY(100%)";
      panel.style.opacity = "0";
      requestAnimationFrame(() => {
        panel.style.transition = "transform 320ms cubic-bezier(0.16,1,0.3,1), opacity 280ms ease";
        panel.style.transform = "translateY(0%)";
        panel.style.opacity = "1";
      });
    } else if (panelVisible) {
      panel.style.transition = "transform 280ms cubic-bezier(0.4,0,1,1), opacity 220ms ease";
      panel.style.transform = "translateY(100%)";
      panel.style.opacity = "0";
      const t = setTimeout(() => {
        panel.style.visibility = "hidden";
        setPanelVisible(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      onClick={onClick}
      className="group"
      style={{
        background: CARD_BG,
        border: `1px solid ${isActive ? BORDER_ACCENT : BORDER}`,
        borderRadius: "3px",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transition: "border-color 200ms ease, box-shadow 200ms ease",
        boxShadow: isActive ? `0 0 0 1px ${BORDER_ACCENT}, 0 4px 24px rgba(229,29,98,0.08)` : "none",
        animationDelay: `${index * 55}ms`,
        animationFillMode: "both",
        animationName: "cardFadeIn",
        animationDuration: "400ms",
        animationTimingFunction: "ease",
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = BORDER_HOVER; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = BORDER; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <span style={{ fontFamily: "'Viewport', sans-serif", fontSize: "11px", color: MUTED, letterSpacing: "0.06em" }}>{num}</span>
        <span style={{
          fontFamily: "'Viewport', sans-serif",
          fontSize: "9px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "3px 7px",
          borderRadius: "2px",
          border: `1px solid ${feature.status === "available" ? BORDER_ACCENT : BORDER}`,
          color: feature.status === "available" ? ACCENT : MUTED,
          background: feature.status === "available" ? "rgba(229,29,98,0.08)" : "transparent",
        }}>
          {feature.status === "available" ? "Available" : "Soon"}
        </span>
      </div>

      <h3 style={{ fontSize: "15px", fontWeight: "800", fontStyle: "italic", color: CREAM, marginBottom: "8px", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
        {feature.name}
      </h3>
      <p style={{ fontSize: "12px", color: MUTED, lineHeight: 1.65, margin: 0 }}>{feature.short}</p>

      <div
        ref={panelRef}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "72%",
          background: BG, borderTop: `1px solid ${BORDER_ACCENT}`,
          padding: "16px 18px 18px", visibility: "hidden",
          display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "10px",
        }}
      >
        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          style={{ position: "absolute", top: "10px", right: "12px", background: "transparent", border: "none", color: MUTED, cursor: "pointer", fontSize: "14px", padding: "2px" }}
        ><X size={20} /></button>

        <p style={{ fontSize: "12px", color: CREAM, lineHeight: 1.7, overflowY: "auto", marginTop: "2px", paddingRight: "6px", flex: 1 }}>
          {feature.long}
        </p>

        {feature.status === "available" ? (
          <a href="#" onClick={e => e.stopPropagation()} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", fontSize: "11px", fontWeight: "800", fontStyle: "italic",
            letterSpacing: "0.02em", color: BG, background: CREAM, borderRadius: "3px",
            textDecoration: "none", width: "fit-content",
          }}>
            Open tool →
          </a>
        ) : (
          <span style={{
            display: "inline-flex", padding: "8px 16px", fontSize: "11px",
            fontWeight: "800", fontStyle: "italic", color: CREAM, opacity: 0.3,
            border: `1px solid ${BORDER}`, borderRadius: "3px", width: "fit-content",
          }}>
            Coming soon
          </span>
        )}
      </div>
    </div>
  );
}

export default function Features() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <section id="features" style={{ position: "relative", background: BG, overflow: "hidden", padding: "72px 20px", fontFamily: "inherit" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${horizBg}, ${vertBg}`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "44px", textAlign: "center" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: ACCENT }}>Features</span>
            <h2 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: "900", fontStyle: "italic", color: CREAM, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "8px 0 10px" }}>
              Everything you need<span style={{ color: ACCENT }}>.</span>
            </h2>
            <p style={{ fontSize: "12.5px", color: MUTED, margin: 0 }}>A growing toolkit for web developers. Tap any card to learn more.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))", gap: "10px" }}
            onClick={e => { if (e.target === e.currentTarget) setActiveId(null); }}
          >
            {features.map((f, i) => (
              <FeatureCard
                key={f.name}
                feature={f}
                index={i}
                isActive={activeId === i}
                onClick={() => setActiveId(p => p === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
