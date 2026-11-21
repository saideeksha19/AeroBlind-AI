import { ArrowUpRight, BookOpen, Github, ShieldAlert } from 'lucide-react';
import { REPOSITORY_LINKS } from '../data/researchData';

export function ResearchFooter() {
  return (
    <footer id="methodology" className="bg-white">
      {/* Methodology & Project Limitations */}
      <div className="border-b border-[#DCE0D8] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="font-mono text-xs tracking-wider text-[#147D80]">
              07 · METHODOLOGY &amp; LIMITATIONS
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
              Research Methodology &amp; Scientific Boundaries
            </h2>
            <p className="mt-3 text-base leading-relaxed text-[#475569]">
              Full transparency into feature extraction, target missingness handling,
              site-based validation protocols, and the scope limitations of this
              research platform.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Methodology */}
            <div className="rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#147D80]">
                <BookOpen className="h-5 w-5" />
                <h3 className="font-display text-xl font-semibold text-[#101D2B]">
                  Methodology
                </h3>
              </div>

              <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-[#475569]">
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    14-Band Satellite Chip Processing:
                  </strong>{' '}
                  Each site observation ingests co-located 14-band Sentinel-2
                  multispectral patches paired with environmental tabular context.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    67 Extracted Image Features:
                  </strong>{' '}
                  Distributional statistics, inter-band spectral ratios, and spatial
                  texture descriptors summarize the 14 spectral bands into 67 compact
                  features without overfitting limited site counts.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    Target Missingness Handling:
                  </strong>{' '}
                  Partial target availability across CH₄, NO₂, CO, AAI, and FIRMS is
                  handled via masked per-target training and MCRMSE evaluation.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    Site-Based Validation:
                  </strong>{' '}
                  Cross-validation folds and Exp09 holdout evaluation group observations
                  strictly by geographic site to prevent spatial data leakage.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    Model Configurations &amp; Target-Specific Strategy:
                  </strong>{' '}
                  ExtraTrees (Exp01, Exp06) and CatBoost (Exp02, Exp07) are combined via
                  target-specific ensemble weighting (Exp08 exploratory blend: 0.92399
                  OOF; Exp09 separate site-level holdout: 0.86305).
                </li>
              </ul>
            </div>

            {/* Limitations */}
            <div className="rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#9E3B3B]">
                <ShieldAlert className="h-5 w-5" />
                <h3 className="font-display text-xl font-semibold text-[#101D2B]">
                  Explicit Limitations
                </h3>
              </div>

              <ul className="mt-5 space-y-3.5 text-sm leading-relaxed text-[#475569]">
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    Standardized Target Predictions Only:
                  </strong>{' '}
                  Outputs correspond to standardized competition target indicators—not
                  calibrated physical atmospheric concentration readings.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    Synthetic Website Demonstration:
                  </strong>{' '}
                  The interactive Atmospheric Intelligence Laboratory computes
                  illustrative deterministic curves for sensitivity exploration; it is
                  not live model inference, and spread bands are not calibrated
                  confidence intervals.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    Validation Results vs. Leaderboard:
                  </strong>{' '}
                  All recorded MCRMSE values (0.95581 to 0.86305) are internal
                  validation results, not Kaggle leaderboard scores. Exp08 (0.92399) is
                  optimistic due to in-OOF blend weight tuning, and Exp09 (0.86305)
                  uses a separate site-level holdout not directly comparable to Exp08.
                </li>
                <li>
                  <strong className="font-semibold text-[#101D2B]">
                    No Real-Time Monitoring Claim:
                  </strong>{' '}
                  AeroBlind AI is an offline research platform and does not ingest
                  real-time satellite streams or bundle competition datasets or TIFFs.
                </li>
              </ul>
            </div>
          </div>

          {/* Research Documentation & External Links */}
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-xl border border-[#DCE0D8] bg-[#F7F7F3] p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#101D2B]">
                Research Documentation &amp; External References
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#526071]">
                Review the open research codebase, official OBSCURA Kaggle challenge
                overview, and Devpost project documentation.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={REPOSITORY_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C9CEC4] bg-white px-4 py-2 text-xs font-semibold text-[#101D2B] transition-colors hover:border-[#147D80] hover:text-[#147D80] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80]"
              >
                <Github className="h-4 w-4" />
                GitHub Repository
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <a
                href={REPOSITORY_LINKS.competition}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-[#147D80] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0F6568] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#101D2B]"
              >
                Kaggle OBSCURA
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>

              <a
                href={REPOSITORY_LINKS.devpost}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-[#C9CEC4] bg-white px-4 py-2 text-xs font-semibold text-[#101D2B] transition-colors hover:border-[#648CA6] hover:text-[#147D80] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80]"
              >
                Devpost Project
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Footer */}
      <div className="bg-[#F7F7F3]">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-xs text-[#526071] sm:flex-row sm:items-center sm:px-6">
          <div>
            <p className="font-display text-sm font-semibold text-[#101D2B]">
              AEROBLIND AI
            </p>
            <p className="mt-1">
              Seeing the Invisible: Multimodal AI for Atmospheric Pollution
              Reconstruction using 14-band Sentinel-2 imagery and environmental context.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <a
              href="#hero"
              className="transition-colors hover:text-[#147D80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm"
            >
              Back to top
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={REPOSITORY_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#147D80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm"
            >
              GitHub
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={REPOSITORY_LINKS.competition}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#147D80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm"
            >
              Kaggle
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={REPOSITORY_LINKS.devpost}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#147D80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] rounded-sm"
            >
              Devpost
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
