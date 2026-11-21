import { Layers } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

const SPECTRAL_STACK_SRC =
  '/src/assets/images/sentinel_spectral_layers_1795258570175.jpg';

export function ResearchOverview() {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const canObserveViewport = typeof IntersectionObserver !== 'undefined';

  return (
    <section
      id="overview"
      className="border-b border-[#DCE0D8] bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left: Scientific Figure of 14-Band Sentinel-2 Stack */}
          <motion.div
            initial={
              prefersReducedMotion || !canObserveViewport
                ? false
                : { opacity: 0, y: 12 }
            }
            whileInView={canObserveViewport ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <figure className="rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-4">
              {!imageError ? (
                <img
                  src={SPECTRAL_STACK_SRC}
                  alt="Architectural diagram of stacked multispectral Sentinel-2 satellite bands above terrain grid"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="aspect-[4/3] w-full rounded-lg border border-[#E2E4DD] object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col items-center justify-center rounded-lg border border-[#E2E4DD] bg-white p-6 text-center">
                  <Layers className="h-12 w-12 text-[#147D80]" />
                  <p className="mt-3 font-mono text-xs text-[#526071]">
                    14-Band Sentinel-2 Spectral Stack
                  </p>
                </div>
              )}
              <figcaption className="mt-3 flex items-baseline justify-between gap-2 text-xs text-[#526071]">
                <span className="italic">
                  Fig. 02 — Stacked multispectral bands paired with environmental site covariates.
                </span>
                <span className="font-mono text-[11px] text-[#147D80] shrink-0">
                  67 features
                </span>
              </figcaption>
            </figure>
          </motion.div>

          {/* Right: Research Question & Modality Synthesis */}
          <motion.div
            initial={
              prefersReducedMotion || !canObserveViewport
                ? false
                : { opacity: 0, y: 12 }
            }
            whileInView={canObserveViewport ? { opacity: 1, y: 0 } : undefined}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-xs tracking-wider text-[#147D80]">
              01 · RESEARCH OVERVIEW
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
              Can AI reconstruct atmospheric signals from satellite observations?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              Ground monitoring stations offer sparse spatial coverage, while optical
              Earth-observation satellites pass continuously over diverse landscapes.
              AeroBlind AI investigates how structured environmental metadata and
              multispectral satellite chips complement one another to predict five
              standardized atmospheric pollution indicators.
            </p>

            {/* Two Input Modalities */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-5">
                <p className="font-mono text-xs font-semibold text-[#648CA6]">
                  MODALITY 01
                </p>
                <h3 className="mt-2 text-base font-semibold text-[#101D2B]">
                  Environmental Tabular Features
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Captures regional meteorology, seasonal cycles, terrain context, and
                  station-level background covariates that govern atmospheric dispersion
                  and baseline transport.
                </p>
              </div>

              <div className="rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-5">
                <p className="font-mono text-xs font-semibold text-[#147D80]">
                  MODALITY 02
                </p>
                <h3 className="mt-2 text-base font-semibold text-[#101D2B]">
                  14-Band Sentinel-2 Satellite Chips
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Extracts 67 statistical, spectral-ratio, and spatial texture descriptors
                  across all fourteen multispectral bands—capturing surface reflectance
                  cues invisible to tabular metadata alone.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#E7E9E2] pt-5 text-sm leading-relaxed text-[#475569]">
              <strong className="font-semibold text-[#101D2B]">
                Joint Reconstruction Objective:
              </strong>{' '}
              Fused representations train ExtraTrees and CatBoost ensembles with
              target-specific combinations to jointly predict standardized{' '}
              <span className="font-mono text-[#101D2B]">CH₄</span>,{' '}
              <span className="font-mono text-[#101D2B]">NO₂</span>,{' '}
              <span className="font-mono text-[#101D2B]">CO</span>,{' '}
              <span className="font-mono text-[#101D2B]">AAI</span>, and{' '}
              <span className="font-mono text-[#101D2B]">FIRMS</span> indicators under
              strict site-grouped validation.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
