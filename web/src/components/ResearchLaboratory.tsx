import { CheckCircle2, FileText } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EXPERIMENTS_TIMELINE } from '../data/researchData';
import { ExperimentRecord } from '../types/aeroblind';

type PhaseFilter = 'All' | ExperimentRecord['phase'];

const FILTER_OPTIONS: PhaseFilter[] = [
  'All',
  'Foundations',
  'Ablation',
  'Validation',
];

export function ResearchLaboratory() {
  const [phaseFilter, setPhaseFilter] = useState<PhaseFilter>('All');
  const [selectedId, setSelectedId] = useState<string>('exp-07');

  const visibleExperiments = useMemo(() => {
    if (phaseFilter === 'All') return EXPERIMENTS_TIMELINE;
    return EXPERIMENTS_TIMELINE.filter((exp) => exp.phase === phaseFilter);
  }, [phaseFilter]);

  const selectedExperiment = useMemo(() => {
    return (
      visibleExperiments.find((e) => e.id === selectedId) ??
      visibleExperiments[0] ??
      EXPERIMENTS_TIMELINE[0]
    );
  }, [visibleExperiments, selectedId]);

  const handlePhaseChange = (phase: PhaseFilter) => {
    setPhaseFilter(phase);
    const nextList =
      phase === 'All'
        ? EXPERIMENTS_TIMELINE
        : EXPERIMENTS_TIMELINE.filter((exp) => exp.phase === phase);
    if (nextList.length > 0 && !nextList.some((exp) => exp.id === selectedId)) {
      setSelectedId(nextList[0].id);
    }
  };

  return (
    <section
      id="experiments"
      className="border-b border-[#DCE0D8] bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs tracking-wider text-[#147D80]">
              05 · EXPERIMENT JOURNEY (01–10)
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
              Ten-Stage Research Timeline
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#475569]">
              Chronological research record from tabular baselines (Exp 01–02) and
              14-band Sentinel-2 feature engineering (Exp 04) through multimodal
              ablations (Exp 06–07), exploratory blending (Exp 08), and separate
              site-level holdout evaluation (Exp 09).
            </p>
          </div>

          {/* Interactive Phase Filter */}
          <div
            role="group"
            aria-label="Filter experiments by phase"
            className="flex flex-wrap items-center gap-1 rounded-md border border-[#DCE0D8] bg-[#F7F7F3] p-1"
          >
            {FILTER_OPTIONS.map((phase) => {
              const active = phaseFilter === phase;
              return (
                <button
                  key={phase}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handlePhaseChange(phase)}
                  className={`min-h-[36px] rounded px-3.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                    active
                      ? 'bg-[#147D80] text-white font-semibold'
                      : 'text-[#475569] hover:text-[#101D2B]'
                  }`}
                >
                  {phase}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Timeline List */}
          <div className="space-y-2.5 lg:col-span-7">
            {visibleExperiments.length === 0 ? (
              <div className="rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-6 text-sm text-[#526071]">
                No experiments match this filter.
              </div>
            ) : (
              visibleExperiments.map((exp) => {
                const isSelected = selectedExperiment.id === exp.id;
                return (
                  <button
                    key={exp.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(exp.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                      isSelected
                        ? 'border-[#147D80] bg-white shadow-[0_2px_10px_rgba(20,125,128,0.08)]'
                        : 'border-[#DCE0D8] bg-[#F7F7F3] hover:border-[#94A3B8]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono text-xs font-semibold tabular-nums ${
                            isSelected ? 'text-[#147D80]' : 'text-[#526071]'
                          }`}
                        >
                          EXP {exp.number}
                        </span>
                        <span className="text-xs text-[#94A3B8]">·</span>
                        <span className="text-xs text-[#526071]">{exp.phase}</span>
                      </div>

                      {exp.recordedMcrmse ? (
                        <span className="font-mono text-xs font-semibold text-[#147D80] tabular-nums">
                          MCRMSE {exp.recordedMcrmse}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-[#64748B]">
                          {exp.validationInfo}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 text-base font-semibold text-[#101D2B]">
                      {exp.title}
                    </h3>

                    <p className="mt-1 text-xs text-[#475569] line-clamp-2">
                      {exp.objective}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Sticky Editorial Inspector Panel */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCE0D8] pb-4">
                <span className="font-mono text-xs font-semibold text-[#147D80]">
                  EXPERIMENT {selectedExperiment.number} · {selectedExperiment.phase}
                </span>
                <span className="font-mono text-[11px] text-[#526071]">
                  {selectedExperiment.validationInfo}
                </span>
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold text-[#101D2B]">
                {selectedExperiment.title}
              </h3>

              <div className="mt-5 rounded-lg border border-[#DCE0D8] bg-white p-4">
                {selectedExperiment.recordedMcrmse ? (
                  <div>
                    <p className="text-xs text-[#526071]">
                      Recorded Validation MCRMSE (lower is better)
                    </p>
                    <p className="mt-1 font-mono text-3xl font-semibold text-[#101D2B] tabular-nums">
                      {selectedExperiment.recordedMcrmse}
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#648CA6]">
                      {selectedExperiment.validationInfo}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 text-xs text-[#475569]">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#648CA6]" />
                    <div>
                      <p className="font-semibold text-[#101D2B]">
                        Pipeline &amp; Audit Milestone
                      </p>
                      <p className="mt-1 leading-relaxed text-[#526071]">
                        No scalar MCRMSE score is fabricated for this pipeline
                        foundation/diagnostic stage; only verified benchmark metrics
                        (Exp 01, 02, 06, 07, 08, 09) are reported.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-4 text-sm leading-relaxed">
                <div>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#526071]">
                    Research Objective
                  </h4>
                  <p className="mt-1 text-[#334155]">
                    {selectedExperiment.objective}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#526071]">
                    Method
                  </h4>
                  <p className="mt-1 text-[#334155]">
                    {selectedExperiment.method}
                  </p>
                </div>

                <div>
                  <h4 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#526071]">
                    Main Finding
                  </h4>
                  <div className="mt-1 flex items-start gap-2 text-[#101D2B]">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#147D80]" />
                    <p>{selectedExperiment.mainFinding}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
