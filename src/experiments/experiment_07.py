# AeroBlind AI ? Experiment 07
# Extracted from notebook cell 13.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd
from catboost import CatBoostRegressor
from sklearn.model_selection import GroupKFold
from sklearn.metrics import mean_squared_error
import time

print("=" * 70)
print("AEROBLIND AI - EXPERIMENT 07")
print("CATBOOST: TABULAR vs MULTIMODAL")
print("=" * 70)

TARGETS = ["t_ch4", "t_no2", "t_co", "t_aai", "t_firms"]

TAB_FEATURES = [
    c for c in train.columns
    if c not in ["sample_id", "site_key"] + TARGETS
]

IMG_FEATURES = [
    c for c in image_features.columns if c != "sample_id"
]

MULTI_FEATURES = TAB_FEATURES + IMG_FEATURES

cv = GroupKFold(n_splits=5)
results = []
start_time = time.time()

for target in TARGETS:
    print(f"\nTARGET: {target}")

    mask = train[target].notna()
    y = train.loc[mask, target].astype(float)
    groups = train.loc[mask, "site_key"]

    X_tab = train.loc[mask, TAB_FEATURES].copy()
    X_multi = train_multi.loc[mask, MULTI_FEATURES].copy()

    tab_oof = np.full(len(y), np.nan)
    multi_oof = np.full(len(y), np.nan)

    for fold, (tr_idx, val_idx) in enumerate(
        cv.split(X_tab, y, groups=groups), start=1
    ):
        model_tab = CatBoostRegressor(
            iterations=700,
            depth=5,
            learning_rate=0.03,
            loss_function="RMSE",
            l2_leaf_reg=5,
            random_seed=42,
            verbose=False,
            allow_writing_files=False,
            thread_count=-1
        )

        model_multi = CatBoostRegressor(
            iterations=700,
            depth=5,
            learning_rate=0.03,
            loss_function="RMSE",
            l2_leaf_reg=5,
            random_seed=42,
            verbose=False,
            allow_writing_files=False,
            thread_count=-1
        )

        model_tab.fit(X_tab.iloc[tr_idx], y.iloc[tr_idx])
        tab_oof[val_idx] = model_tab.predict(X_tab.iloc[val_idx])

        model_multi.fit(X_multi.iloc[tr_idx], y.iloc[tr_idx])
        multi_oof[val_idx] = model_multi.predict(X_multi.iloc[val_idx])

        print(f"  Fold {fold}/5 completed")

    tab_rmse = np.sqrt(mean_squared_error(y, tab_oof))
    multi_rmse = np.sqrt(mean_squared_error(y, multi_oof))

    improvement = (tab_rmse - multi_rmse) / tab_rmse * 100

    results.append({
        "target": target,
        "catboost_tabular_rmse": tab_rmse,
        "catboost_multimodal_rmse": multi_rmse,
        "improvement_percent": improvement
    })

    print(f"  CatBoost tabular:    {tab_rmse:.5f}")
    print(f"  CatBoost multimodal: {multi_rmse:.5f}")
    print(f"  Improvement:        {improvement:+.2f}%")

results_df = pd.DataFrame(results)

print("\n" + "=" * 70)
print("EXPERIMENT 07 RESULTS")
print("=" * 70)

display(results_df.round(5))

print("\nCATBOOST TABULAR MCRMSE:",
      round(results_df["catboost_tabular_rmse"].mean(), 5))

print("CATBOOST MULTIMODAL MCRMSE:",
      round(results_df["catboost_multimodal_rmse"].mean(), 5))

results_df.to_csv(
    "/kaggle/working/aeroblind_experiment07_results.csv",
    index=False
)

print("\nSaved: aeroblind_experiment07_results.csv")
print(f"Elapsed: {(time.time() - start_time) / 60:.1f} minutes")
