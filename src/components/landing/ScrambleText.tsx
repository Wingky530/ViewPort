import { useEffect, useRef } from 'react';
import { createTimeline } from 'animejs';

const WORDS = [
  'preview responsive layouts',
  'inspect with devtools',
  'test performance',
  'check accessibility',
  'analyze your site',
];
const CHARS = '!<>-_\\/[]{}—=+*^?#';

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function scrambleFrame(span: HTMLSpanElement, frames: number, final: string) {
  let f = 0;
  const tick = () => {
    if (f < frames) {
      span.textContent = randomChar();
      f++;
      requestAnimationFrame(tick);
    } else {
      span.textContent = final;
    }
  };
  requestAnimationFrame(tick);
}

export default function ScrambleText() {
  const ref = useRef<HTMLSpanElement>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let currentTl: ReturnType<typeof createTimeline> | null = null;

    const animateWord = async (word: string) => {
      if (cancelled) return;
      el.innerHTML = '';
      const spans: HTMLSpanElement[] = [];
      for (const char of word) {
        const span = document.createElement('span');
        if (char === ' ') {
          span.textContent = ' ';
          span.dataset.char = ' ';
          span.style.cssText = 'display:inline;color:#252422';
        } else {
          span.textContent = '·';
          span.dataset.char = char;
          span.style.cssText = 'display:inline-block;color:#252422';
        }
        el.appendChild(span);
        spans.push(span);
      }

      const n = spans.length;
      const revealEnd = (n - 1) * 50 + 350;
      const pauseEnd = revealEnd + 2500;

      const tl = createTimeline();

      spans.forEach((span, i) => {
        tl.add(span, {
          opacity: [0, 1],
          color: ['#5A5957', '#252422'],
          duration: 250,
          ease: 'outQuad',
          onBegin: () => {
            if (span.dataset.char !== ' ') scrambleFrame(span, 6, span.dataset.char || '');
            else span.textContent = ' ';
          },
        }, i * 60);
      });

      tl.add({ duration: 2000 }, revealEnd);

      [...spans].reverse().forEach((span, i) => {
        tl.add(span, {
          opacity: [1, 0],
          duration: 120,
          ease: 'inQuad',
          onBegin: () => {
            if (span.dataset.char !== ' ') scrambleFrame(span, 3, '·');
            else span.textContent = ' ';
          },
        }, pauseEnd + i * 35);
      });

      currentTl = tl;
      await tl;
    };

    (async () => {
      while (!cancelled) {
        try {
          await animateWord(WORDS[idxRef.current % WORDS.length]);
          idxRef.current++;
          if (!cancelled) await new Promise((r) => setTimeout(r, 500));
        } catch {
          // ignore — keep cycling
        }
      }
    })();

    return () => {
      cancelled = true;
      if (currentTl) currentTl.revert();
    };
  }, []);

  return <span ref={ref} className="inline-block min-w-[28ch] text-left" />;
}
