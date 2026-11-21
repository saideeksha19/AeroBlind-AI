# AeroBlind AI
## Seeing the Invisible: Multimodal AI for Atmospheric Pollution Reconstruction

AeroBlind AI is a research project developed for the OBSCURA Kaggle competition. It investigates whether Sentinel-2 image-derived features, together with weather, terrain and spectral-index features, can help reconstruct five atmospheric measurements at previously unseen sites.

### Prediction targets
- `t_ch4` — methane enhancement
- `t_no2` — nitrogen dioxide enhancement
- `t_co` — carbon monoxide enhancement
- `t_aai` — absorbing aerosol index
- `t_firms` — fire and flare intensity

### Dataset
The competition provides 3,218 training rows, 1,221 test rows and 4,439 anonymized 384 × 384 pixel, 14-band image chips. The tabular inputs contain weather, terrain and spectral summaries. Missing target values represent unavailable measurements, not zero.

### Method
1. Inspect target availability and site grouping.
2. Establish ExtraTrees and CatBoost tabular baselines.
3. Audit image metadata and image-to-sample mapping.
4. Extract image statistics from Sentinel-2 bands, scene classification and cloud probability.
5. Compare tabular and multimodal models using five-fold GroupKFold validation by `site_key`.
6. Explore target-specific model blending.
7. Select blending weights using inner site-grouped validation and evaluate on a separate site-level holdout.
8. Train final models and generate test predictions.

### Experiment highlights
- Experiment 01: ExtraTrees tabular baseline MCRMSE 0.95581; mean baseline 1.00897.
- Experiment 02: CatBoost tabular baseline MCRMSE 0.95143.
- Experiment 05: extracted 67 image features per sample from all 4,439 image chips.
- Experiment 06: ExtraTrees multimodal MCRMSE 0.95105 versus tabular 0.97102.
- Experiment 07: CatBoost multimodal MCRMSE 0.93078 versus tabular 0.95874.
- Experiment 08: exploratory target-wise blend OOF MCRMSE 0.92399. This is an exploratory score because blend weights were selected on the same OOF predictions used for scoring.
- Experiment 09: independent site-level holdout MCRMSE 0.86305. This is a separate holdout result and is not directly comparable to the five-fold OOF scores because target availability and held-out sites differ.
- Experiment 10: trained final target-specific models and generated predictions for all 1,221 test rows.

### Final model configuration
| Target | Model A | Features A | Model B | Features B | Weight A |
|---|---|---|---|---|---:|
| t_ch4 | ExtraTrees | Multimodal | CatBoost | Tabular | 0.70 |
| t_no2 | ExtraTrees | Tabular | CatBoost | Multimodal | 0.55 |
| t_co | CatBoost | Multimodal | ExtraTrees | Multimodal | 0.90 |
| t_aai | CatBoost | Multimodal | ExtraTrees | Multimodal | 1.00 |
| t_firms | CatBoost | Multimodal | ExtraTrees | Multimodal | 0.90 |

### Repository structure
- `notebooks/` — complete research notebook with experiment outputs.
- `results/` — summarized validation results.
- `docs/` — methodology and research notes.
- `src/` — reserved for reusable source modules.

### Reproducibility
The notebook was developed in Kaggle with the official OBSCURA competition data mounted under `/kaggle/input`. To reproduce the experiments, join the competition, accept its rules, attach its dataset to a Kaggle notebook, and execute the research notebook in order.

The competition dataset is not included in this repository. Do not redistribute competition images, tables, sample identifiers or other restricted data. The notebook's Kaggle-specific paths and runtime dependencies must be available for execution.

### Limitations
- Targets are noisy z-scores and some are sparsely observed.
- Generalization to unseen sites and later time periods is challenging.
- The Experiment 08 blend score is exploratory and may be optimistic.
- The Experiment 09 holdout score is based on a particular site split and should not be interpreted as a guaranteed leaderboard score.
- No claim is made that model predictions are direct measurements of emissions or facility-level emission rates.

### Competition and data acknowledgement
Developed for the OBSCURA competition. The competition describes inputs derived from Copernicus Sentinel-2, Sentinel-5P/TROPOMI, ECMWF ERA5-Land, Copernicus DEM and NASA FIRMS. Please refer to the official competition page and rules for data licensing and attribution.

Competition: https://www.kaggle.com/competitions/obscura
