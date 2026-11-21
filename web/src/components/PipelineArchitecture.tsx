import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { useState } from 'react';
import { PIPELINE_STAGES } from '../data/researchData';

const SPECTRAL_STACK_SRC =
  '/src/assets/images/sentinel_spectral_layers_1795258570175.jpg';

export function PipelineArchitecture() {
  const [activeStageId, setActiveStageId] = useState<string>(
    PIPELINE_STAGES[0].id
  );
  const [imageError, setImageError] = useState(false);

  const activeIndex = Math.max(
    0,
    PIPELINE_STAGES.findIndex((s) => s.id === activeStageId)
  );
  const activeStage = PIPELINE_STAGES[activeIndex] ?? PIPELINE_STAGES[0];

  const handlePrevStage = () => {
    if (activeIndex > 0) {
      setActiveStageId(PIPELINE_STAGES[activeIndex - 1].id);
    }
  };

  const handleNextStage = () => {
    if (activeIndex < PIPELINE_STAGES.length - 1) {
      setActiveStageId(PIPELINE_STAGES[activeIndex + 1].id);
    }
  };

  return (
    <section
      id="pipeline"
      className="border-b border-[#DCE0D8] bg-[#F7F7F3] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-wider text-[#147D80]">
            06 · MULTIMODAL PIPELINE
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
            From Satellite Chips &amp; Covariates to Five Targets
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[#475569]">
            Inspect each stage of the six-step reconstruction workflow—from 14-band
            Sentinel-2 chip ingestion and 67-feature extraction to target-specific
            ExtraTrees and CatBoost model combinations.
          </p>
        </div>

        {/* Interactive 6-Stage Scientific Process Flow */}
        <div
          role="tablist"
          aria-label="Multimodal pipeline stages"
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6"
        >
          {PIPELINE_STAGES.map((stage, index) => {
            const isActive = stage.id === activeStage.id;
            return (
              <div key={stage.id} className="relative flex items-stretch">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`flex w-full flex-col justify-between rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                    isActive
                      ? 'border-[#147D80] bg-white shadow-[0_2px_10px_rgba(20,125,128,0.08)]'
                      : 'border-[#DCE0D8] bg-white/70 hover:border-[#94A3B8] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-semibold tabular-nums ${
                        isActive ? 'text-[#147D80]' : 'text-[#526071]'
                      }`}
                    >
                      Stage {stage.step}
                    </span>
                    {index < PIPELINE_STAGES.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-[#94A3B8] lg:hidden"
                      />
                    )}
                  </div>

                  <p className="mt-3 text-sm font-semibold leading-snug text-[#101D2B]">
                    {stage.shortLabel}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#526071]">
                    {stage.title}
                  </p>
                </button>
              </div>
            );
          })}
        </div>

        {/* Stage Detail Inspector + Multispectral Layer Plate */}
        <div className="mt-8 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded-xl border border-[#DCE0D8] bg-white p-6 lg:col-span-7">
            <div>
              <div className="flex items-center justify-between border-b border-[#E7E9E2] pb-4">
                <span className="font-mono text-xs font-semibold text-[#147D80]">
                  STAGE {activeStage.step} SPECIFICATION
                </span>
                <span className="font-mono text-xs text-[#648CA6]">
                  {activeStage.shortLabel}
                </span>
              </div>

              <h3 className="mt-4 font-display text-2xl font-semibold text-[#101D2B]">
                {activeStage.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
                {activeStage.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#E7E9E2] pt-5 sm:grid-cols-2">
                <div className="rounded-lg border border-[#DCE0D8] bg-[#F7F7F3] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#526071]">
                    Stage Inputs
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#101D2B]">
                    {activeStage.inputs}
                  </p>
                </div>
                <div className="rounded-lg border border-[#DCE0D8] bg-[#F7F7F3] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#526071]">
                    Stage Outputs
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#147D80] font-medium">
                    {activeStage.outputs}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#E7E9E2] pt-4">
              <p className="text-xs font-semibold text-[#101D2B]">
                Research Rationale
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                {activeStage.researchRationale}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-[#E7E9E2] pt-4">
                <button
                  type="button"
                  onClick={handlePrevStage}
                  disabled={activeIndex === 0}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-[#DCE0D8] bg-[#F7F7F3] px-3 py-1.5 text-xs font-medium text-[#101D2B] transition-colors hover:border-[#147D80] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80]"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous Stage
                </button>
                <span className="font-mono text-xs text-[#526071] tabular-nums">
                  {activeIndex + 1} / {PIPELINE_STAGES.length}
                </span>
                <button
                  type="button"
                  onClick={handleNextStage}
                  disabled={activeIndex === PIPELINE_STAGES.length - 1}
                  className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md border border-[#DCE0D8] bg-[#F7F7F3] px-3 py-1.5 text-xs font-medium text-[#101D2B] transition-colors hover:border-[#147D80] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80]"
                >
                  Next Stage
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          <figure className="flex flex-col justify-between overflow-hidden rounded-xl border border-[#DCE0D8] bg-white p-4 lg:col-span-5">
            {!imageError ? (
              <img
                src={SPECTRAL_STACK_SRC}
                alt="Scientific architectural diagram of stacked 14-band Sentinel-2 spectral channels"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-64 w-full rounded-lg border border-[#E7E9E2] object-cover lg:h-full"
              />
            ) : (
              <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-[#E7E9E2] bg-[#F7F7F3] p-6 text-center lg:h-full">
                <Layers className="h-12 w-12 text-[#147D80]" />
                <p className="mt-3 font-mono text-xs text-[#526071]">
                  14-Band Sentinel-2 Feature Stack
                </p>
              </div>
            )}
            <figcaption className="mt-3 border-t border-[#E7E9E2] pt-3 text-xs leading-relaxed text-[#526071]">
              <span className="font-mono text-[#147D80]">Fig. 03 —</span>{' '}
              Conceptual schematic of 14-band Sentinel-2 extraction (67 summary
              features) fused with site meteorology. No competition imagery displayed.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
