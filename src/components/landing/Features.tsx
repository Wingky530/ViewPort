import { tools } from "./features/tools";
import ResponsivePreviewer from "./features/ResponsivePreviewer";
import { ToolSoonSection } from "./features/ToolSoon";

export default function Features() {
  const available = tools.filter((t) => t.status === "available");
  const soon = tools.filter((t) => t.status === "soon");

  return (
    <>
      <section id="features" className="pt-24 px-6">
        <div className="mx-auto text-center max-w-[640px] mb-4">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-black italic text-text leading-[1.05] tracking-tight" style={{ textWrap: 'balance' }}>
            Test, inspect, debug<span className="text-accent">.</span>
          </h2>
          <p className="mt-2 text-xs text-text-muted">
            Nine tools for the responsive web. One available now, more coming.
          </p>
          <div className="mx-auto mt-6 w-12 h-px" style={{ background: "color-mix(in srgb, var(--color-accent) 25%, transparent)" }} />
        </div>
      </section>

      {available.map((tool) => (
        <ResponsivePreviewer key={tool.name} tool={tool} />
      ))}

      <ToolSoonSection tools={soon} />
    </>
  );
}

