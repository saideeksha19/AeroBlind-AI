export type TargetId = 'CH4' | 'NO2' | 'CO' | 'AAI' | 'FIRMS';

export interface AtmosphericTarget {
  id: TargetId;
  formula: string;
  name: string;
  indicatorLabel: string;
  unit: string;
  spectralContext: string;
  researchContext: string;
  summary: string;
  accentHex: string;
  /** Illustrative synthetic baseline and range used strictly for the interactive demo */
  syntheticBaseline: number;
  syntheticMin: number;
  syntheticMax: number;
  syntheticWeights: {
    spectralIndex: number;
    thermalProxy: number;
    windDispersion: number;
    aerosolLoad: number;
    cloudMasking: number;
  };
}

export interface SyntheticCovariates {
  spectralIndex: number;
  thermalProxy: number;
  windDispersion: number;
  aerosolLoad: number;
  cloudMasking: number;
}

export interface SyntheticScenario {
  id: string;
  name: string;
  regimeDescription: string;
  covariates: SyntheticCovariates;
}

export type ValidationProtocol = 'OOF' | 'Holdout';

export interface ModelBenchmark {
  id: string;
  experimentCode: string;
  modelName: string;
  modality: 'Tabular' | 'Multimodal' | 'Ensemble Blend';
  mcrmse: number;
  protocol: ValidationProtocol;
  caveat: string;
  notes: string;
}

export interface AblationPair {
  family: string;
  tabularExp: string;
  multimodalExp: string;
  tabular: number;
  multimodal: number;
  delta: number;
}

export interface ExperimentRecord {
  id: string;
  number: string;
  title: string;
  phase: 'Foundations' | 'Ablation' | 'Validation';
  objective: string;
  method: string;
  validationInfo: string;
  recordedMcrmse: string | null;
  mainFinding: string;
}

export interface PipelineStage {
  id: string;
  step: string;
  title: string;
  shortLabel: string;
  inputs: string;
  outputs: string;
  description: string;
  researchRationale: string;
}
