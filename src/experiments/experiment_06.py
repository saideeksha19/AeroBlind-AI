# AeroBlind AI ? Experiment 06
# Extracted from notebook cell 12.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd
from sklearn.model_selection import GroupKFold
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.metrics import mean_squared_error
from catboost import CatBoostRegressor
import time

print("=" * 70)
print("AEROBLIND AI - EXPERIMENT 06")
print("TABULAR vs MULTIMODAL VALIDATION")
print("=" * 70)

# Define columns
TARGETS = ["t_ch4", "t_no2", "t_co", "t_aai", "t_firms"]

TAB_FEATURES = [
    c for c in train.columns
    if c not in ["sample_id", "site_key"] + TARGETS
]

IMG_FEATURES = [
    c for c in image_features.columns if c != "sample_id"
]

MULTI_FEATURES = TAB_FEATURES + IMG_FEATURES

groups = train["site_key"]
cv = GroupKFold(n_splits=5)

results = []
start_time = time.time()

for target in TARGETS:
    print(f"\nTARGET: {target}")

    y_all = train[target]
    valid_label_mask = y_all.notna()

    y = y_all[valid_label_mask].astype(float)
    target_groups = groups[valid_label_mask]

    X_tab = train.loc[valid_label_mask, TAB_FEATURES].copy()
    X_multi = train_multi.loc[valid_label_mask, MULTI_FEATURES].copy()

    # Same site-grouped folds for both feature sets
    tab_oof = np.full(len(y), np.nan)
    multi_oof = np.full(len(y), np.nan)

    for fold, (tr_idx, val_idx) in enumerate(
        cv.split(X_tab, y, groups=target_groups), start=1
    ):
        y_tr = y.iloc[tr_idx]

        # ExtraTrees: tabular-only
        et_tab = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("model", ExtraTreesRegressor(
                n_estimators=300,
                max_features=0.8,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ))
        ])
        et_tab.fit(X_tab.iloc[tr_idx], y_tr)
        tab_oof[val_idx] = et_tab.predict(X_tab.iloc[val_idx])

        # ExtraTrees: tabular + image features
        et_multi = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("model", ExtraTreesRegressor(
                n_estimators=300,
                max_features=0.8,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ))
        ])
        et_multi.fit(X_multi.iloc[tr_idx], y_tr)
        multi_oof[val_idx] = et_multi.predict(X_multi.iloc[val_idx])

        print(f"  Fold {fold}/5 completed")

    tab_rmse = np.sqrt(mean_squared_error(y, tab_oof))
    multi_rmse = np.sqrt(mean_squared_error(y, multi_oof))

    improvement = (tab_rmse - multi_rmse) / tab_rmse * 100

    results.append({
        "target": target,
        "tabular_rmse": tab_rmse,
        "multimodal_rmse": multi_rmse,
        "improvement_percent": improvement
    })

    print(f"  Tabular RMSE:   {tab_rmse:.5f}")
    print(f"  Multimodal RMSE:{multi_rmse:.5f}")
    print(f"  Improvement:    {improvement:+.2f}%")

results_df = pd.DataFrame(results)

print("\n" + "=" * 70)
print("EXPERIMENT 06 RESULTS")
print("=" * 70)
display(results_df.round(5))

print("\nTABULAR MCRMSE:  ", round(results_df["tabular_rmse"].mean(), 5))
print("MULTIMODAL MCRMSE:", round(results_df["multimodal_rmse"].mean(), 5))

overall_improvement = (
    results_df["tabular_rmse"].mean()
    - results_df["multimodal_rmse"].mean()
) / results_df["tabular_rmse"].mean() * 100

print(f"OVERALL IMPROVEMENT: {overall_improvement:+.2f}%")

results_df.to_csv(
    "/kaggle/working/aeroblind_experiment06_results.csv",
    index=False
)

print("\nResults saved: aeroblind_experiment06_results.csv")
print(f"Elapsed time: {(time.time() - start_time) / 60:.1f} minutes")
