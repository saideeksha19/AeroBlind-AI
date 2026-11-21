import { describe, expect, it } from 'vitest';
import {
  ABLATION_PAIRS,
  ATMOSPHERIC_TARGETS,
  EXPERIMENTS_TIMELINE,
  PIPELINE_STAGES,
  RECORDED_BENCHMARKS,
  REPOSITORY_LINKS,
  SYNTHETIC_SCENARIOS,
  TARGET_BY_ID,
  computeSyntheticDemoOutput,
} from '../data/researchData';

describe('Research benchmark & scientific integrity invariants', () => {
  it('records exact MCRMSE benchmarks without altering values', () => {
    const byId = Object.fromEntries(RECORDED_BENCHMARKS.map((b) => [b.id, b]));
    expect(byId['exp01-et-tab'].mcrmse).toBe(0.95581);
    expect(byId['exp02-cb-tab'].mcrmse).toBe(0.95143);
    expect(byId['exp06-et-multi'].mcrmse).toBe(0.95105);
    expect(byId['exp07-cb-multi'].mcrmse).toBe(0.93078);
    expect(byId['exp08-blend'].mcrmse).toBe(0.92399);
    expect(byId['exp09-holdout'].mcrmse).toBe(0.86305);
  });

  it('distinguishes OOF CV protocols from the separate site-level Holdout protocol', () => {
    const oof = RECORDED_BENCHMARKS.filter((b) => b.protocol === 'OOF');
    const holdout = RECORDED_BENCHMARKS.filter((b) => b.protocol === 'Holdout');
    expect(oof.length).toBe(5);
    expect(holdout.length).toBe(1);
    expect(holdout[0].experimentCode).toBe('Exp 09');
  });

  it('shows negative MCRMSE delta (improvement) for both ExtraTrees and CatBoost multimodal ablations', () => {
    expect(ABLATION_PAIRS).toHaveLength(2);
    for (const pair of ABLATION_PAIRS) {
      expect(pair.multimodal).toBeLessThan(pair.tabular);
      expect(pair.delta).toBeLessThan(0);
    }
  });

  it('contains Experiments 01-10 without fabricating metrics for unrecorded runs', () => {
    expect(EXPERIMENTS_TIMELINE).toHaveLength(10);
    const unrecorded = EXPERIMENTS_TIMELINE.filter((e) => e.recordedMcrmse === null);
    expect(unrecorded.map((e) => e.number)).toEqual(['03', '04', '05', '10']);
    const recorded = EXPERIMENTS_TIMELINE.filter((e) => e.recordedMcrmse !== null);
    expect(recorded.map((e) => e.number)).toEqual(['01', '02', '06', '07', '08', '09']);
  });

  it('defines five standardized atmospheric targets, six pipeline stages, and official links', () => {
    expect(ATMOSPHERIC_TARGETS.map((t) => t.id)).toEqual([
      'CH4',
      'NO2',
      'CO',
      'AAI',
      'FIRMS',
    ]);
    for (const target of ATMOSPHERIC_TARGETS) {
      expect(target.unit).toBe('std. index (synthetic)');
    }
    expect(PIPELINE_STAGES).toHaveLength(6);
    expect(SYNTHETIC_SCENARIOS).toHaveLength(4);
    expect(REPOSITORY_LINKS.github).toBe('https://github.com/saideeksha19/AeroBlind-AI');
    expect(REPOSITORY_LINKS.competition).toBe(
      'https://www.kaggle.com/competitions/obscura/overview'
    );
    expect(REPOSITORY_LINKS.devpost).toBe('https://obscura.devpost.com/');
  });
});

describe('computeSyntheticDemoOutput safety & sensitivity', () => {
  it('never returns NaN or Infinity even under invalid or extreme inputs', () => {
    const badInputs = [
      {
        spectralIndex: Number.NaN,
        thermalProxy: Number.POSITIVE_INFINITY,
        windDispersion: Number.NEGATIVE_INFINITY,
        aerosolLoad: -500,
        cloudMasking: 9999,
      },
      {
        spectralIndex: 0,
        thermalProxy: 0,
        windDispersion: 0,
        aerosolLoad: 0,
        cloudMasking: 0,
      },
      {
        spectralIndex: 100,
        thermalProxy: 100,
        windDispersion: 100,
        aerosolLoad: 100,
        cloudMasking: 100,
      },
    ];

    for (const target of ATMOSPHERIC_TARGETS) {
      for (const input of badInputs) {
        const res = computeSyntheticDemoOutput(target, input);
        expect(Number.isFinite(res.value)).toBe(true);
        expect(Number.isFinite(res.lowerBound)).toBe(true);
        expect(Number.isFinite(res.upperBound)).toBe(true);
        expect(Number.isFinite(res.spread)).toBe(true);
        expect(Number.isFinite(res.normalizedPosition)).toBe(true);
        expect(Number.isFinite(res.spreadStartPct)).toBe(true);
        expect(Number.isFinite(res.spreadWidthPct)).toBe(true);
        expect(res.value).toBeGreaterThanOrEqual(target.syntheticMin);
        expect(res.value).toBeLessThanOrEqual(target.syntheticMax);
        expect(res.lowerBound).toBeLessThanOrEqual(res.value);
        expect(res.upperBound).toBeGreaterThanOrEqual(res.value);
        expect(res.spreadStartPct).toBeGreaterThanOrEqual(0);
        expect(res.spreadStartPct + res.spreadWidthPct).toBeLessThanOrEqual(100.001);
      }
    }
  });

  it('guards against degenerate target min/max ranges without dividing by zero', () => {
    const degenerateTarget = {
      ...TARGET_BY_ID.CH4,
      syntheticMin: 100,
      syntheticMax: 100,
      syntheticBaseline: 100,
    };
    const res = computeSyntheticDemoOutput(
      degenerateTarget,
      SYNTHETIC_SCENARIOS[0].covariates
    );
    expect(Number.isFinite(res.value)).toBe(true);
    expect(Number.isFinite(res.normalizedPosition)).toBe(true);
  });

  it('responds monotonically to spectral index and cloud occlusion spread', () => {
    const base = SYNTHETIC_SCENARIOS[0].covariates;
    const lowSpectral = computeSyntheticDemoOutput(TARGET_BY_ID.CH4, {
      ...base,
      spectralIndex: 15,
    });
    const highSpectral = computeSyntheticDemoOutput(TARGET_BY_ID.CH4, {
      ...base,
      spectralIndex: 90,
    });
    expect(highSpectral.value).toBeGreaterThan(lowSpectral.value);

    const clearSky = computeSyntheticDemoOutput(TARGET_BY_ID.NO2, {
      ...base,
      cloudMasking: 5,
    });
    const heavyCloud = computeSyntheticDemoOutput(TARGET_BY_ID.NO2, {
      ...base,
      cloudMasking: 95,
    });
    expect(heavyCloud.spread).toBeGreaterThan(clearSky.spread);
  });
});
