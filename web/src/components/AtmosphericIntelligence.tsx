import { AlertCircle, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  ATMOSPHERIC_TARGETS,
  SYNTHETIC_SCENARIOS,
  TARGET_BY_ID,
  computeSyntheticDemoOutput,
} from '../data/researchData';
import { SyntheticCovariates, TargetId } from '../types/aeroblind';

interface AtmosphericIntelligenceProps {
  activeTarget: TargetId;
  onSelectTarget: (id: TargetId) => void;
}

const SLIDER_FIELDS: Array<{
  key: keyof SyntheticCovariates;
  label: string;
  lowLabel: string;
  highLabel: string;
}> = [
  {
    key: 'spectralIndex',
    label: 'Synthetic Spectral Band Index',
    lowLabel: 'Background',
    highLabel: 'Peak Contrast',
  },
  {
    key: 'thermalProxy',
    label: 'Synthetic Thermal Anomaly Proxy',
    lowLabel: 'Ambient',
    highLabel: 'Elevated Flux',
  },
  {
    key: 'aerosolLoad',
    label: 'Synthetic Aerosol Optical Proxy',
    lowLabel: 'Clear Column',
    highLabel: 'Dense Plume',
  },
  {
    key: 'windDispersion',
    label: 'Synthetic Wind Ventilation',
    lowLabel: 'Stagnant',
    highLabel: 'Strong Advection',
  },
  {
    key: 'cloudMasking',
    label: 'Synthetic Cloud Occlusion',
    lowLabel: 'Cloud-Free',
    highLabel: 'Heavy Cover',
  },
];

export function AtmosphericIntelligence({
  activeTarget,
  onSelectTarget,
}: AtmosphericIntelligenceProps) {
  const [scenarioId, setScenarioId] = useState<string>(SYNTHETIC_SCENARIOS[0].id);
  const [covariates, setCovariates] = useState<SyntheticCovariates>(
    SYNTHETIC_SCENARIOS[0].covariates
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const target = TARGET_BY_ID[activeTarget];
  const currentScenario =
    SYNTHETIC_SCENARIOS.find((s) => s.id === scenarioId) ?? SYNTHETIC_SCENARIOS[0];

  const isCustomized = useMemo(() => {
    const base = currentScenario.covariates;
    return (
      covariates.spectralIndex !== base.spectralIndex ||
      covariates.thermalProxy !== base.thermalProxy ||
      covariates.windDispersion !== base.windDispersion ||
      covariates.aerosolLoad !== base.aerosolLoad ||
      covariates.cloudMasking !== base.cloudMasking
    );
  }, [covariates, currentScenario]);

  useEffect(() => {
    setIsUpdating(true);
    const timer = window.setTimeout(() => setIsUpdating(false), 150);
    return () => window.clearTimeout(timer);
  }, [activeTarget, scenarioId]);

  const handleScenarioSelect = (id: string) => {
    const found = SYNTHETIC_SCENARIOS.find((s) => s.id === id);
    if (!found) return;
    setScenarioId(id);
    setCovariates({ ...found.covariates });
  };

  const handleSliderChange = (key: keyof SyntheticCovariates, val: number) => {
    setCovariates((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setCovariates({ ...currentScenario.covariates });
  };

  const demoOutput = useMemo(
    () => computeSyntheticDemoOutput(target, covariates),
    [target, covariates]
  );

  const decimals = 2;

  return (
    <section
      id="intelligence"
      className="border-b border-[#DCE0D8] bg-[#F7F7F3] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header & Explicit Synthetic Banner */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs tracking-wider text-[#147D80]">
              02 · ATMOSPHERIC INTELLIGENCE LABORATORY
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
              Interactive Synthetic Reconstruction Instrument
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#475569]">
              Adjust synthetic spectral and meteorological parameters to observe how
              multimodal inputs shift standardized indicator estimates across the five
              research targets.
            </p>
          </div>

          <div
            role="note"
            className="flex items-start gap-3 rounded-lg border border-[#D4B483] bg-[#FDF9F0] px-4 py-3 text-xs leading-relaxed text-[#784A0D] lg:max-w-md"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]" />
            <span>
              <strong className="font-semibold text-[#5C3606]">
                ILLUSTRATIVE SYNTHETIC DEMONSTRATION — NOT LIVE MODEL INFERENCE.
              </strong>{' '}
              Outputs reflect deterministic synthetic sensitivity curves, not actual
              competition test predictions or real-time satellite feeds.
            </span>
          </div>
        </div>

        {/* Target Selector Bar */}
        <div className="mt-10 flex flex-col gap-4 border-y border-[#DCE0D8] py-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="Select atmospheric target"
          >
            {ATMOSPHERIC_TARGETS.map((item) => {
              const selected = item.id === activeTarget;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => onSelectTarget(item.id)}
                  className={`min-h-[40px] rounded-md px-3.5 py-2 font-mono text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                    selected
                      ? 'bg-[#147D80] text-white'
                      : 'border border-[#D4D8CF] bg-white text-[#101D2B] hover:border-[#147D80]/60 hover:text-[#147D80]'
                  }`}
                >
                  {item.id} · {item.name}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleReset}
            disabled={!isCustomized}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-md border px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
              isCustomized
                ? 'border-[#C9CEC4] bg-white text-[#101D2B] hover:border-[#147D80] hover:text-[#147D80]'
                : 'border-[#E2E4DD] bg-[#EFEFEA] text-[#94A3B8] cursor-not-allowed'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Synthetic Profile
          </button>
        </div>

        {/* Split Research Instrument Console */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Parameter Control Surface */}
          <div className="rounded-xl border border-[#DCE0D8] bg-white p-6 lg:col-span-5">
            <div className="flex items-center justify-between border-b border-[#E7E9E2] pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-[#147D80]" />
                <h3 className="text-sm font-semibold text-[#101D2B]">
                  Synthetic Input Parameters
                </h3>
              </div>
              <span className="font-mono text-xs text-[#648CA6]">
                {isCustomized ? 'Custom Profile' : 'Preset Active'}
              </span>
            </div>

            {/* Scenario Presets */}
            <div className="mt-5">
              <p className="text-xs font-medium text-[#475569]">
                Synthetic Atmospheric Regime Preset
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {SYNTHETIC_SCENARIOS.map((sc) => {
                  const active = sc.id === scenarioId;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleScenarioSelect(sc.id)}
                      className={`min-h-[42px] rounded-md border px-3 py-2 text-left text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                        active
                          ? 'border-[#147D80] bg-[#147D80]/10 text-[#0F5B5D] font-semibold'
                          : 'border-[#DCE0D8] bg-[#F7F7F3] text-[#334155] hover:border-[#648CA6]'
                      }`}
                    >
                      {sc.name}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2.5 text-xs leading-relaxed text-[#526071]">
                {currentScenario.regimeDescription}
              </p>
            </div>

            {/* Covariate Sliders */}
            <div className="mt-6 space-y-5 border-t border-[#E7E9E2] pt-5">
              {SLIDER_FIELDS.map((field) => {
                const value = covariates[field.key];
                return (
                  <div key={field.key}>
                    <div className="flex items-center justify-between text-xs">
                      <label
                        htmlFor={`slider-${field.key}`}
                        className="font-medium text-[#101D2B]"
                      >
                        {field.label}
                      </label>
                      <span className="font-mono font-semibold text-[#147D80] tabular-nums">
                        {value} / 100
                      </span>
                    </div>
                    <input
                      id={`slider-${field.key}`}
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={value}
                      onChange={(e) =>
                        handleSliderChange(field.key, Number(e.target.value))
                      }
                      className="aero-slider mt-2 w-full"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-[#64748B]">
                      <span>{field.lowLabel}</span>
                      <span>{field.highLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Illustrative Output & Spectral Profile */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Standardized Illustrative Output Readout */}
            <div className="rounded-xl border border-[#DCE0D8] bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E7E9E2] pb-5">
                <div>
                  <p className="font-mono text-xs text-[#648CA6]">
                    ILLUSTRATIVE SYNTHETIC PREDICTION · {target.id} ({target.name})
                  </p>
                  <div className="mt-2 flex items-baseline gap-2.5">
                    <span
                      className={`font-mono text-4xl font-semibold tracking-tight text-[#101D2B] tabular-nums transition-opacity duration-150 sm:text-5xl ${
                        isUpdating ? 'opacity-45' : 'opacity-100'
                      }`}
                    >
                      {demoOutput.value >= 0 ? '+' : ''}
                      {demoOutput.value.toFixed(decimals)}
                    </span>
                    <span className="font-mono text-xs uppercase text-[#526071]">
                      {target.unit}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs text-[#526071]">Spectral Sensitivity</p>
                  <p className="mt-1 font-mono text-xs text-[#147D80]">
                    {target.spectralContext}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-[#64748B] tabular-nums">
                    Synthetic neutral baseline: +{target.syntheticBaseline.toFixed(decimals)}
                  </p>
                </div>
              </div>

              {/* Illustrative Synthetic Spread Visualization */}
              <div className="mt-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-[#101D2B]">
                    Illustrative Synthetic Spread (Not Calibrated Model Confidence)
                  </span>
                  <span className="font-mono text-[#334155] tabular-nums">
                    {demoOutput.lowerBound.toFixed(decimals)} to{' '}
                    {demoOutput.upperBound.toFixed(decimals)} ({'±'}
                    {demoOutput.spread.toFixed(decimals)})
                  </span>
                </div>

                <div
                  aria-label="Illustrative synthetic spread indicator"
                  className="relative mt-3 h-3 w-full overflow-hidden rounded-full border border-[#DCE0D8] bg-[#F7F7F3]"
                >
                  <div
                    className="absolute top-0 bottom-0 bg-[#648CA6]/35 transition-all duration-150"
                    style={{
                      left: `${demoOutput.spreadStartPct}%`,
                      width: `${demoOutput.spreadWidthPct}%`,
                    }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#147D80] transition-all duration-150"
                    style={{
                      left: `calc(${Math.min(99, Math.max(1, demoOutput.normalizedPosition))}% - 2px)`,
                    }}
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[11px] text-[#64748B] tabular-nums">
                  <span>Min {target.syntheticMin.toFixed(decimals)}</span>
                  <span>Max +{target.syntheticMax.toFixed(decimals)}</span>
                </div>
                <p className="mt-1.5 text-[11px] text-[#526071]">
                  Spread widens proportionally as synthetic cloud occlusion increases ({covariates.cloudMasking}%).
                </p>
              </div>
            </div>

            {/* Radar Chart & Directional Feature Profile */}
            <div className="grid grid-cols-1 gap-6 rounded-xl border border-[#DCE0D8] bg-white p-6 md:grid-cols-12">
              <div className="min-w-0 md:col-span-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#101D2B]">
                    Synthetic Feature Profile
                  </h3>
                  <span className="font-mono text-[11px] text-[#526071]">
                    0–100 normalized scale
                  </span>
                </div>

                <div className="mt-3 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="64%"
                      data={demoOutput.featureProfile}
                    >
                      <PolarGrid stroke="#E2E4DD" />
                      <PolarAngleAxis
                        dataKey="axis"
                        tick={{ fill: '#475569', fontSize: 10 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#94A3B8', fontSize: 9 }}
                        axisLine={false}
                      />
                      <Radar
                        name="Synthetic Profile"
                        dataKey="value"
                        stroke="#147D80"
                        strokeWidth={2}
                        fill="#147D80"
                        fillOpacity={0.18}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#DCE0D8',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#101D2B',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-col justify-between border-t border-[#E7E9E2] pt-4 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <div>
                  <h4 className="text-xs font-semibold text-[#101D2B]">
                    Synthetic Directional Sensitivity
                  </h4>
                  <p className="mt-1 text-xs text-[#526071]">
                    Illustrative pull relative to {target.formula} neutral midpoint.
                  </p>

                  <ul className="mt-4 space-y-3">
                    {demoOutput.featureProfile.map((item) => {
                      const positive = item.impact >= 0;
                      return (
                        <li
                          key={item.axis}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-[#334155]">{item.axis}</span>
                          <span
                            className={`font-mono font-medium tabular-nums ${
                              positive ? 'text-[#147D80]' : 'text-[#9E3B3B]'
                            }`}
                          >
                            {positive ? `+${item.impact}` : item.impact} idx
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <p className="mt-5 border-t border-[#E7E9E2] pt-3 text-[11px] leading-relaxed text-[#526071]">
                  Synthetic demonstration only. Standardized outputs do not represent
                  physical concentration readings or live competition inference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
