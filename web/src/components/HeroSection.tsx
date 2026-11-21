import { ArrowDownRight, ArrowRight, Compass } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { ATMOSPHERIC_TARGETS } from '../data/researchData';
import { TargetId } from '../types/aeroblind';
import { AtmosphericCanvas } from './AtmosphericCanvas';

interface HeroSectionProps {
  activeTarget: TargetId;
  onSelectTarget: (id: TargetId) => void;
}

const HERO_PLATE_SRC =
  '/src/assets/images/observatory_earth_plate_1795258570898.jpg';

const METADATA_ITEMS = [
  'Multimodal learning',
  'Sentinel-2 imagery',
  'Five prediction targets',
  'Site-level validation',
] as const;

export function HeroSection({ activeTarget, onSelectTarget }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);

  const handleTargetClick = (id: TargetId) => {
    onSelectTarget(id);
    const el = document.getElementById('intelligence');
    if (el) {
      el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-[#DCE0D8] bg-[#F7F7F3]"
    >
      <AtmosphericCanvas />

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Editorial Cover Typography */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-[#147D80]">
              ATMOSPHERIC INTELLIGENCE / MULTIMODAL AI RESEARCH
            </p>

            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06]">
              Seeing the Invisible.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-[#475569] sm:text-lg">
              Reconstructing atmospheric pollution indicators through multispectral
              satellite imagery and environmental intelligence.
            </p>

            {/* Compact Five-Target Research Line */}
            <div className="mt-7 border-t border-[#DCE0D8] pt-5">
              <p className="font-mono text-[11px] text-[#526071]">
                Standardized Research Targets (select to inspect in laboratory)
              </p>
              <div
                role="group"
                aria-label="Atmospheric target quick selectors"
                className="mt-2.5 flex flex-wrap items-center gap-2"
              >
                {ATMOSPHERIC_TARGETS.map((target, idx) => {
                  const isSelected = activeTarget === target.id;
                  return (
                    <div key={target.id} className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleTargetClick(target.id)}
                        className={`min-h-[40px] rounded-md border px-3 py-1.5 font-mono text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                          isSelected
                            ? 'border-[#147D80] bg-[#147D80] text-white'
                            : 'border-[#D4D8CF] bg-white text-[#101D2B] hover:border-[#147D80]/60 hover:text-[#147D80]'
                        }`}
                      >
                        {target.formula}
                      </button>
                      {idx < ATMOSPHERIC_TARGETS.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="hidden font-mono text-xs text-[#94A3B8] sm:inline"
                        >
                          /
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary & Secondary Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#intelligence"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#147D80] px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#0F6568] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101D2B]"
              >
                Explore the Intelligence
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="#research"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C9CEC4] bg-white px-6 py-2.5 text-sm font-medium text-[#101D2B] transition-colors duration-150 hover:border-[#147D80] hover:text-[#147D80] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80]"
              >
                View Research
                <ArrowDownRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* Scientific Instrument Cartographic Plate */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <figure className="rounded-xl border border-[#D4D8CF] bg-white p-3.5 shadow-[0_1px_3px_rgba(16,29,43,0.04)] sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E9E2] pb-2.5 text-[11px] font-mono text-[#526071]">
                <span>PLATE 01 · SPECTRAL CONTOUR &amp; TOPOGRAPHIC FRAME</span>
                <span className="text-[#147D80]">14-Band Sentinel-2 Scope</span>
              </div>

              <div className="relative mt-3 overflow-hidden rounded-lg border border-[#E7E9E2] bg-[#F7F7F3]">
                {!imageError ? (
                  <img
                    src={HERO_PLATE_SRC}
                    alt="Scientific cartographic plate showing coastal topography and atmospheric spectral isolines"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] w-full flex-col items-center justify-center bg-[#F2F3EE] p-6 text-center">
                    <Compass className="h-12 w-12 text-[#648CA6]" />
                    <p className="mt-3 font-mono text-xs text-[#526071]">
                      Multispectral Earth-Observation Plate
                    </p>
                  </div>
                )}

                {/* Subtle SVG Scientific Calibration Overlay */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 300"
                  className="pointer-events-none absolute inset-0 h-full w-full"
                >
                  <circle
                    cx="210"
                    cy="148"
                    r="76"
                    fill="none"
                    stroke="#147D80"
                    strokeWidth="0.9"
                    strokeDasharray="4 4"
                    opacity="0.55"
                  />
                  <circle
                    cx="210"
                    cy="148"
                    r="116"
                    fill="none"
                    stroke="#648CA6"
                    strokeWidth="0.75"
                    opacity="0.4"
                  />
                  <line
                    x1="210"
                    y1="56"
                    x2="210"
                    y2="240"
                    stroke="#101D2B"
                    strokeWidth="0.6"
                    opacity="0.25"
                  />
                  <line
                    x1="118"
                    y1="148"
                    x2="302"
                    y2="148"
                    stroke="#101D2B"
                    strokeWidth="0.6"
                    opacity="0.25"
                  />
                </svg>

                {/* Crisp Architectural Caption Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E7E9E2] bg-white/95 px-3.5 py-2.5 font-mono text-[11px] text-[#475569]">
                  <span>Ch. 1–14 Spectral Tensor · 67 Extracted Features</span>
                  <span className="text-[#101D2B] font-medium tabular-nums">
                    Holdout MCRMSE 0.86305
                  </span>
                </div>
              </div>

              <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#526071]">
                <span>
                  Illustrative cartographic figure of multimodal spatial context.
                </span>
                <span className="font-mono text-[11px] text-[#648CA6]">
                  Offline validation study · Not live monitoring
                </span>
              </figcaption>
            </figure>
          </motion.div>
        </div>

        {/* Research Metadata Strip */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#DCE0D8] pt-5 text-xs text-[#526071] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-medium text-[#101D2B]">
            {METADATA_ITEMS.map((item, idx) => (
              <span key={item} className="inline-flex items-center gap-3">
                <span>{item}</span>
                {idx < METADATA_ITEMS.length - 1 && (
                  <span aria-hidden="true" className="text-[#94A3B8]">
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="font-mono text-[11px] text-[#526071]">
            OBSCURA Research Archive · Retrospective Validation
          </p>
        </div>
      </div>
    </section>
  );
}
