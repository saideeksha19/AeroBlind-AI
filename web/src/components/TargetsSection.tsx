import { ArrowUpRight } from 'lucide-react';
import { ATMOSPHERIC_TARGETS } from '../data/researchData';
import { TargetId } from '../types/aeroblind';

interface TargetsSectionProps {
  activeTarget: TargetId;
  onSelectTarget: (id: TargetId) => void;
}

export function TargetsSection({
  activeTarget,
  onSelectTarget,
}: TargetsSectionProps) {
  const handleInspect = (id: TargetId) => {
    onSelectTarget(id);
    const el = document.getElementById('intelligence');
    if (el) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      id="targets"
      className="border-b border-[#DCE0D8] bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-[#147D80]">
            03 · FIVE ATMOSPHERIC TARGETS
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
            Standardized Pollution &amp; Fire-Related Indicators
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#475569]">
            AeroBlind AI predicts five standardized atmospheric indicators jointly
            evaluated under Mean Columnwise Root Mean Squared Error (MCRMSE), rather
            than uncalibrated physical concentration readings.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {ATMOSPHERIC_TARGETS.map((target, idx) => {
            const isActive = activeTarget === target.id;
            return (
              <article
                key={target.id}
                className={`flex flex-col justify-between rounded-xl border bg-[#F7F7F3] p-6 transition-colors duration-150 ${
                  isActive
                    ? 'border-[#147D80] bg-white shadow-[0_2px_10px_rgba(20,125,128,0.08)]'
                    : 'border-[#DCE0D8] hover:border-[#94A3B8]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#E2E4DD] pb-3">
                    <span className="font-mono text-xs text-[#526071] tabular-nums">
                      Target 0{idx + 1} · {target.id}
                    </span>
                    <span
                      className="inline-flex items-center gap-2 font-mono text-sm font-semibold"
                      style={{ color: target.accentHex }}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: target.accentHex }}
                      />
                      {target.formula}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold text-[#101D2B]">
                    {target.name}
                  </h3>

                  <p className="mt-2.5 text-sm leading-relaxed text-[#475569]">
                    {target.summary}
                  </p>

                  <dl className="mt-5 space-y-2.5 border-t border-[#E2E4DD] pt-4 text-xs">
                    <div>
                      <dt className="font-medium text-[#526071]">
                        Multispectral Context
                      </dt>
                      <dd className="mt-0.5 font-mono text-[#101D2B]">
                        {target.spectralContext}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-medium text-[#526071]">
                        Research Context
                      </dt>
                      <dd className="mt-0.5 leading-relaxed text-[#475569]">
                        {target.researchContext}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-6 pt-2">
                  <button
                    type="button"
                    onClick={() => handleInspect(target.id)}
                    className={`inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm ${
                      isActive
                        ? 'text-[#147D80]'
                        : 'text-[#101D2B] hover:text-[#147D80]'
                    }`}
                  >
                    {isActive
                      ? 'Active in Synthetic Laboratory'
                      : `Inspect ${target.id} in Demo`}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
