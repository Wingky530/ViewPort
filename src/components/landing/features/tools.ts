export interface SubFeature {
  id: string;
  label: string;
  description: string;
  snippet: string;
  spanFull?: boolean;
}

export interface Tool {
  name: string;
  status: "available" | "soon";
  description: string;
  href?: string;
  features?: SubFeature[];
  /** Hue value (0-360) for tinting soon-tool cards */
  accentHue?: number;
}

export const tools: Tool[] = [
  {
    name: "Responsive Preview",
    status: "available",
    href: "/tools/responsive",
    description:
      "Test your layouts across devices in real time. Resize, rotate, and capture any URL.",
    features: [
      {
        id: "fig-01",
        label: "MULTIPLE DEVICES",
        description:
          "Preview your site across mobile, tablet, and desktop simultaneously.",
        snippet: '{ device: "iPhone 15" }',
        spanFull: true,
      },
      {
        id: "fig-02",
        label: "CUSTOM SIZE",
        description:
          "Drag to any resolution. Test breakpoints without predefined presets.",
        snippet: "{ width: 375, height: 812 }",
      },
      {
        id: "fig-03",
        label: "ROTATE",
        description:
          "Flip between portrait and landscape. See how your layout responds.",
        snippet: '{ orientation: "landscape" }',
      },
      {
        id: "fig-04",
        label: "SCREENSHOT",
        description:
          "Capture precise preview states for documentation or bug reports.",
        snippet: "capture()",
      },
      {
        id: "fig-05",
        label: "HISTORY",
        description:
          "Quickly revisit URLs you've tested. Navigate with arrow keys.",
        snippet: "history.back()",
      },
    ],
  },
  {
    name: "CSS Inspector",
    status: "soon",
    accentHue: 220,
    description:
      "Hover to highlight, click to inspect. Computed styles, box model, and live editing.",
  },
  {
    name: "Color Picker",
    status: "soon",
    accentHue: 330,
    description:
      "Extract colors from any element. HEX, RGB, HSL formats with one-click copy.",
  },
  {
    name: "Performance Monitor",
    status: "soon",
    accentHue: 150,
    description:
      "Real-time Core Web Vitals, FPS counter, network timeline, and memory usage.",
  },
  {
    name: "DOM Tree Inspector",
    status: "soon",
    accentHue: 30,
    description:
      "Interactive DOM tree with attribute editing, event listeners, and element search.",
  },
  {
    name: "Console Panel",
    status: "soon",
    accentHue: 270,
    description:
      "Execute JS in iframe context. Logs, warnings, and errors with syntax highlighting.",
  },
  {
    name: "Network Waterfall",
    status: "soon",
    accentHue: 190,
    description:
      "Visualize requests with timing. Headers, response body, and bottleneck detection.",
  },
  {
    name: "Accessibility Audit",
    status: "soon",
    accentHue: 50,
    description:
      "WCAG compliance, contrast ratios, ARIA validation, and detailed audit reports.",
  },
  {
    name: "Lighthouse Integration",
    status: "soon",
    accentHue: 0,
    description:
      "Performance, SEO, best practices, and accessibility scores. Mobile vs Desktop.",
  },
];
