# AeroBlind AI ? Experiment 02
# Extracted from notebook cell 8.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd

from catboost import CatBoostRegressor
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_squared_error

TARGETS = ["t_ch4", "t_no2", "t_co", "t_aai", "t_firms"]
FEATURES = [
    c for c in test.columns
    if c not in ["sample_id", "site_key"]
]

X = train[FEATURES].copy()
groups = train["site_key"]

gkf = GroupKFold(n_splits=5)

all_results = []

print("=" * 70)
print("AEROBLIND AI - EXPERIMENT 02")
print("CATBOOST vs EXTRATREES vs MEAN BASELINE")
print("=" * 70)

for target in TARGETS:

    print(f"\n{'=' * 55}")
    print("TARGET:", target)
    print("=" * 55)

    y = train[target]

    oof_cat = np.full(len(train), np.nan)
    oof_extra = np.full(len(train), np.nan)
    oof_dummy = np.full(len(train), np.nan)

    for fold, (train_idx, valid_idx) in enumerate(
        gkf.split(X, y, groups), start=1
    ):

        # Remove rows with missing target labels
        tr_idx = train_idx[y.iloc[train_idx].notna().values]
        va_idx = valid_idx[y.iloc[valid_idx].notna().values]

        if len(tr_idx) == 0 or len(va_idx) == 0:
            print(f"Fold {fold}: skipped")
            continue

        X_train = X.iloc[tr_idx]
        y_train = y.iloc[tr_idx]

        X_valid = X.iloc[va_idx]
        y_valid = y.iloc[va_idx]

        # Mean baseline
        dummy = DummyRegressor(strategy="mean")
        dummy.fit(X_train, y_train)
        pred_dummy = dummy.predict(X_valid)

        # Extra Trees
        extra_model = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("regressor", ExtraTreesRegressor(
                n_estimators=300,
                max_features=0.8,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ))
        ])

        extra_model.fit(X_train, y_train)
        pred_extra = extra_model.predict(X_valid)

        # CatBoost
        cat_model = CatBoostRegressor(
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

        cat_model.fit(X_train, y_train)
        pred_cat = cat_model.predict(X_valid)

        # Store out-of-fold predictions
        oof_dummy[va_idx] = pred_dummy
        oof_extra[va_idx] = pred_extra
        oof_cat[va_idx] = pred_cat

        # Fold metrics
        rmse_dummy = np.sqrt(mean_squared_error(y_valid, pred_dummy))
        rmse_extra = np.sqrt(mean_squared_error(y_valid, pred_extra))
        rmse_cat = np.sqrt(mean_squared_error(y_valid, pred_cat))

        print(
            f"Fold {fold} | "
            f"Mean: {rmse_dummy:.5f} | "
            f"ExtraTrees: {rmse_extra:.5f} | "
            f"CatBoost: {rmse_cat:.5f}"
        )

    # Overall OOF metrics
    mask = y.notna().values & np.isfinite(oof_cat)

    rmse_dummy = np.sqrt(
        mean_squared_error(y[mask], oof_dummy[mask])
    )

    rmse_extra = np.sqrt(
        mean_squared_error(y[mask], oof_extra[mask])
    )

    rmse_cat = np.sqrt(
        mean_squared_error(y[mask], oof_cat[mask])
    )

    all_results.append({
        "Target": target,
        "Valid labels": int(mask.sum()),
        "Mean baseline": rmse_dummy,
        "ExtraTrees": rmse_extra,
        "CatBoost": rmse_cat
    })

    print("\nOverall OOF:")
    print("Mean baseline:", round(rmse_dummy, 5))
    print("ExtraTrees:", round(rmse_extra, 5))
    print("CatBoost:", round(rmse_cat, 5))

# Final comparison
results_df = pd.DataFrame(all_results)

print("\n" + "=" * 70)
print("EXPERIMENT 02 - FINAL RESULTS")
print("=" * 70)

display(results_df.round(5))

print("\nOVERALL MCRMSE")
print("Mean baseline:", round(results_df["Mean baseline"].mean(), 5))
print("ExtraTrees:", round(results_df["ExtraTrees"].mean(), 5))
print("CatBoost:", round(results_df["CatBoost"].mean(), 5))

print("\nEXPERIMENT 02 COMPLETE")

