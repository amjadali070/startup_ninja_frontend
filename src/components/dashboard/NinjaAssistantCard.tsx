import type { FC } from 'react';

interface NinjaAssistantCardProps {
  suggestions: string[];
}

const NinjaAssistantCard: FC<NinjaAssistantCardProps> = ({ suggestions }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[linear-gradient(160deg,rgba(28,28,43,0.95)_0%,rgba(23,23,35,0.95)_100%)] p-6 xl:p-7">
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
          Ninja Assistant
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">Need a creative jumpstart?</h3>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          Tap into AI powered suggestions to accelerate your next project.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-white/80">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3 border border-white/5"
            >
              <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-[#FF4D4D]" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NinjaAssistantCard;
