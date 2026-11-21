# AEROBLIND AI — Seeing the Invisible

Interactive Scientific Research Observatory web platform for **AeroBlind AI: Multimodal AI for Atmospheric Pollution Reconstruction**, presenting recorded offline validation results alongside an illustrative synthetic sensitivity sandbox for five standardized atmospheric targets (`CH₄`, `NO₂`, `CO`, `AAI`, `FIRMS`).

---

## Scientific Integrity & Scope Distinction

This web application strictly separates **recorded offline research benchmarks** from **interactive synthetic demonstrations**:

- **Recorded Internal Validation Benchmarks (Experiments 01, 02, 06–09)**  
  All published validation numbers come directly from recorded site-grouped experiments evaluated under Mean Columnwise Root Mean Squared Error (**MCRMSE**, where lower is better):
  - **Exp 01 (ExtraTrees, Tabular OOF CV):** `0.95581`
  - **Exp 02 (CatBoost, Tabular OOF CV):** `0.95143`
  - **Exp 06 (ExtraTrees, Multimodal OOF CV):** `0.95105` (`-0.00476` vs Exp 01)
  - **Exp 07 (CatBoost, Multimodal OOF CV):** `0.93078` (`-0.02065` vs Exp 02)
  - **Exp 08 (Exploratory Blend, OOF CV):** `0.92399` *(explicitly flagged as exploratory & optimistic: blend weights were selected and evaluated on the same OOF predictions)*
  - **Exp 09 (Separate Site-Level Holdout):** `0.86305` *(uses a different site-level holdout split; not directly comparable to Exp 08)*

  All metrics are internal validation results—**never** Kaggle leaderboard scores. Diagnostic and engineering milestones (`03`, `04`, `05`, `10`) document methodology without fabricated scores.

- **Standardized Targets & Synthetic Laboratory**  
  The five prediction targets (`CH₄`, `NO₂`, `CO`, `AAI`, `FIRMS`) represent standardized atmospheric pollution and fire-related indicators rather than raw physical concentration units. The interactive Atmospheric Intelligence Laboratory (`computeSyntheticDemoOutput` in `src/data/researchData.ts`) renders deterministic synthetic sensitivity curves labeled **ILLUSTRATIVE SYNTHETIC DEMONSTRATION — NOT LIVE MODEL INFERENCE**. No competition datasets, raw TIFF chips, or restricted sample IDs are bundled.

---

## Website Architecture

```text
├── index.html                  # Light editorial document metadata & typography (Fraunces, DM Sans, JetBrains Mono)
├── metadata.json               # Application manifest
├── package.json                # Dependencies and npm scripts (dev, build, lint, test)
├── vite.config.ts              # Vite + React + Tailwind v4 configuration
├── vitest.config.ts            # Vitest + jsdom test configuration
└── src/
    ├── App.tsx                 # Root page layout, shared target state & ErrorBoundary
    ├── index.css               # Tailwind CSS v4 theme tokens & accessible light-theme slider styling
    ├── main.tsx                # React 19 entry point
    ├── assets/images/          # Observatory Earth-observation plate & 14-band spectral layer diagram
    ├── types/
    │   └── aeroblind.ts        # TypeScript domain interfaces
    ├── data/
    │   └── researchData.ts     # Recorded benchmark data, experiments 01–10 & synthetic sensitivity curves
    ├── components/
    │   ├── Navbar.tsx                  # Sticky navigation bar + Escape-accessible mobile menu
    │   ├── AtmosphericCanvas.tsx       # Reduced-motion-aware cartographic isoline grid canvas
    │   ├── HeroSection.tsx             # Editorial cover, cartographic plate & target selectors
    │   ├── ResearchOverview.tsx        # Research question & 2-modality (tabular + 14-band Sentinel-2) overview
    │   ├── AtmosphericIntelligence.tsx # Synthetic sensitivity instrument, Recharts RadarChart & spread readout
    │   ├── TargetsSection.tsx          # Five standardized atmospheric & fire-related target indicators
    │   ├── ModelPerformance.tsx        # Recharts ablation/progression charts & recorded validation ledger
    │   ├── ResearchLaboratory.tsx      # Filterable Experiments 01–10 timeline & sticky inspector
    │   ├── PipelineArchitecture.tsx    # Interactive 6-stage multimodal reconstruction pipeline
    │   ├── ResearchFooter.tsx          # Methodology, explicit limitations & external reference links
    │   └── ErrorBoundary.tsx           # Runtime visualization recovery boundary
    └── test/
        ├── setup.ts                    # jsdom test environment stubs
        ├── researchData.test.ts        # Numeric safety, bounds & scientific integrity tests
        └── App.test.tsx                # UI interaction & accessibility tests
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally (Development Server)
```bash
npm run dev
```
The development server runs at `http://localhost:3000`.

### 3. Run Type Checks & Automated Tests
```bash
npm run lint
npm test
```

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## Exporting & Integrating into `AeroBlind_AI/web/`

This website is self-contained and does not depend on or modify the Python research `src/` directory. To import it into the original `AeroBlind_AI` repository:

1. Create `AeroBlind_AI/web/` at the root of the Python repository.
2. Copy only the website files into `AeroBlind_AI/web/` (excluding `node_modules/` and `dist/`):
   - `package.json`, `index.html`, `metadata.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `README.md`
   - `src/` (including `src/assets/images/`, `src/components/`, `src/data/`, `src/types/`, `src/test/`)
3. From `AeroBlind_AI\web`, install dependencies and start the server:
   ```powershell
   npm install; npm run dev
   ```

---

## Links

- **GitHub Repository:** https://github.com/saideeksha19/AeroBlind-AI
- **OBSCURA Kaggle Competition:** https://www.kaggle.com/competitions/obscura/overview
- **OBSCURA Devpost Project:** https://obscura.devpost.com/
