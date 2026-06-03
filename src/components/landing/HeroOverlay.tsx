import ScrambleText from './ScrambleText.tsx';

interface Props {
  scrollProgress?: number;
  entryPhase: 'init' | 'blink' | 'reveal';
  dotActive?: boolean;
}

export default function HeroOverlay({ scrollProgress = 0, entryPhase, dotActive = false }: Props) {
  const FADE_START = 0.08;
  const FADE_RANGE = 0.35;
  const topP = scrollProgress < FADE_START
    ? 0
    : Math.min(1, (scrollProgress - FADE_START) / FADE_RANGE);
  const topY = -topP * 60;
  const topOpacity = 1 - topP;

  const isRevealed = entryPhase === 'reveal';

  return (
    <div
      className="max-w-2xl"
      style={{
        transform: isRevealed ? `translateY(${topY}px)` : undefined,
        opacity: isRevealed ? topOpacity : 0,
      }}
    >
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold italic text-[#EB1D62] leading-[1.1] tracking-tight">
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '200ms' }}>All-in-one</span>{' '}
        <br />
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '280ms' }}>web</span>{' '}
        <span className={isRevealed ? 'anim-word' : ''} style={{ animationDelay: '360ms' }}>
          toolkit<span id="title-dot" className={`inline-block w-[0.15em] h-[0.15em] ml-1 mt-[1.7px] transition-colors duration-500 ${dotActive ? 'bg-[#EB1D62]' : 'bg-accent'}`} />
        </span>
      </h1>
      <p className={`mt-0.5 text-sm sm:text-base font-semibold italic text-[#252422] leading-relaxed ${isRevealed ? 'anim-desc' : ''}`}>
        An open-source and free web toolkit to <ScrambleText />
      </p>
    </div>
  );
}
