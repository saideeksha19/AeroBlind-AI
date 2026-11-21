# AeroBlind AI — Methodology and Experiment Notes

## Validation design
The competition separates train and test by facility and time. Therefore, `site_key` is used as a grouping variable for validation and is excluded from model features. Five-fold GroupKFold validation keeps each site in only one fold.

## Missing labels
A missing target means that the satellite measurement was unavailable. Such rows are excluded from the loss for that target; missing values are not replaced with zero labels.

## Image processing
Each TIFF has 12 Sentinel-2 reflectance bands, a scene classification layer and cloud probability. The feature extraction experiment computes per-band mean, standard deviation, 10th percentile and 90th percentile, along with scene-class fractions and cloud-probability summaries. This produces 67 image-derived features per image.

## Model families
ExtraTrees uses median imputation for missing feature values. CatBoost is trained with RMSE loss. Model comparisons use the same site-grouped folds within each paired experiment.

## Blending and holdout
Experiment 08 explores target-wise blends from out-of-fold predictions. Because weights are selected on those same OOF predictions, its reported blend score is exploratory rather than an unbiased final estimate.

Experiment 09 uses a separate site-level holdout. Blend weights are selected using inner GroupKFold predictions on the training sites, then evaluated on held-out sites. Its aggregate score is not directly comparable with Experiment 08 because the evaluation split and target-specific observed labels differ.

## Final prediction
Experiment 10 fits the selected target-specific model configurations on all available labeled training rows for each target and predicts every test row. The submission is aligned to the official sample submission IDs and checked for shape, missing values, duplicate IDs and finite predictions.
