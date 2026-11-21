# AeroBlind AI ? Experiment 01
# Extracted from notebook cell 6.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd

from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_squared_error

TARGETS = ["t_ch4", "t_no2", "t_co", "t_aai", "t_firms"]

# Exclude identifiers and all target columns
FEATURES = [
    c for c in test.columns
    if c not in ["sample_id", "site_key"]
]

X = train[FEATURES].copy()
groups = train["site_key"]

# Five folds, with sites kept separate
gkf = GroupKFold(n_splits=5)

results = []

print("=" * 65)
print("AEROBLIND AI - EXPERIMENT 01")
print("SITE-GROUPED TABULAR BASELINE")
print("=" * 65)

for target in TARGETS:

    print(f"\nTraining target: {target}")

    y = train[target]
    oof_extra = np.full(len(train), np.nan)
    oof_dummy = np.full(len(train), np.nan)

    fold_scores = []

    for fold, (train_idx, valid_idx) in enumerate(
        gkf.split(X, y, groups), start=1
    ):

        # Use only rows with available labels
        valid_train_idx = train_idx[y.iloc[train_idx].notna().values]
        valid_valid_idx = valid_idx[y.iloc[valid_idx].notna().values]

        if len(valid_train_idx) == 0 or len(valid_valid_idx) == 0:
            print(f"Fold {fold}: skipped (no available labels)")
            continue

        X_train = X.iloc[valid_train_idx]
        y_train = y.iloc[valid_train_idx]

        X_valid = X.iloc[valid_valid_idx]
        y_valid = y.iloc[valid_valid_idx]

        # Reference: training-fold mean prediction
        dummy = DummyRegressor(strategy="mean")
        dummy.fit(X_train, y_train)

        dummy_pred = dummy.predict(X_valid)

        # Extra Trees model
        model = Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("regressor", ExtraTreesRegressor(
                n_estimators=300,
                max_features=0.8,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ))
        ])

        model.fit(X_train, y_train)
        predictions = model.predict(X_valid)

        oof_extra[valid_valid_idx] = predictions
        oof_dummy[valid_valid_idx] = dummy_pred

        extra_rmse = np.sqrt(
            mean_squared_error(y_valid, predictions)
        )

        dummy_rmse = np.sqrt(
            mean_squared_error(y_valid, dummy_pred)
        )

        fold_scores.append(extra_rmse)

        print(
            f"Fold {fold}: "
            f"ExtraTrees RMSE={extra_rmse:.5f} | "
            f"Mean baseline RMSE={dummy_rmse:.5f} | "
            f"Validation labels={len(y_valid)}"
        )

    # Overall out-of-fold performance
    mask = y.notna().values & np.isfinite(oof_extra)

    extra_oof_rmse = np.sqrt(
        mean_squared_error(y[mask], oof_extra[mask])
    )

    dummy_oof_rmse = np.sqrt(
        mean_squared_error(y[mask], oof_dummy[mask])
    )

    results.append({
        "Target": target,
        "Valid labels": int(mask.sum()),
        "ExtraTrees OOF RMSE": extra_oof_rmse,
        "Mean baseline OOF RMSE": dummy_oof_rmse,
        "Fold RMSE mean": np.mean(fold_scores)
    })

    print(f"Overall ExtraTrees OOF RMSE: {extra_oof_rmse:.5f}")
    print(f"Overall Mean baseline RMSE: {dummy_oof_rmse:.5f}")

# Final comparison
results_df = pd.DataFrame(results)

print("\n" + "=" * 65)
print("FINAL BASELINE RESULTS")
print("=" * 65)

display(results_df.round(5))

print(
    "\nEXTRATREES MCRMSE:",
    round(results_df["ExtraTrees OOF RMSE"].mean(), 5)
)

print(
    "MEAN BASELINE MCRMSE:",
    round(results_df["Mean baseline OOF RMSE"].mean(), 5)
)

print("\nEXPERIMENT 01 COMPLETE")

