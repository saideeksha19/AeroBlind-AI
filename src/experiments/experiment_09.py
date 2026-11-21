# AeroBlind AI ? Experiment 09
# Extracted from notebook cell 15.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd
import time

from sklearn.model_selection import GroupShuffleSplit, GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.metrics import mean_squared_error
from catboost import CatBoostRegressor

print("=" * 75)
print("AEROBLIND AI - EXPERIMENT 09")
print("INDEPENDENT SITE-LEVEL BLEND VALIDATION")
print("=" * 75)

TARGETS = ["t_ch4", "t_no2", "t_co", "t_aai", "t_firms"]

TAB_FEATURES = [
    c for c in train.columns
    if c not in ["sample_id", "site_key"] + TARGETS
]

IMG_FEATURES = [
    c for c in image_features.columns if c != "sample_id"
]

MULTI_FEATURES = TAB_FEATURES + IMG_FEATURES

# Model choices from previous experiments
CANDIDATES = {
    "t_ch4": [("ET", "multi"), ("CB", "tab")],
    "t_no2": [("ET", "tab"), ("CB", "multi")],
    "t_co": [("CB", "multi"), ("ET", "multi")],
    "t_aai": [("CB", "multi"), ("ET", "multi")],
    "t_firms": [("CB", "multi"), ("ET", "multi")]
}

def build_model(kind):
    if kind == "ET":
        return Pipeline([
            ("imputer", SimpleImputer(strategy="median")),
            ("model", ExtraTreesRegressor(
                n_estimators=300,
                max_features=0.8,
                min_samples_leaf=2,
                random_state=42,
                n_jobs=-1
            ))
        ])

    return CatBoostRegressor(
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

def get_features(feature_type, indices, columns):
    source = train if feature_type == "tab" else train_multi
    return source.iloc[indices][columns].copy()

results09 = []
start_time = time.time()

for target in TARGETS:
    print(f"\nTARGET: {target}")

    valid_indices = np.where(train[target].notna())[0]
    y_all = train.iloc[valid_indices][target].astype(float).reset_index(drop=True)
    groups_all = train.iloc[valid_indices]["site_key"].reset_index(drop=True)

    # Reserve approximately 20% of sites for independent evaluation
    outer_split = GroupShuffleSplit(
        n_splits=1,
        test_size=0.20,
        random_state=2026
    )

    inner_train_idx, holdout_idx = next(
        outer_split.split(
            np.zeros(len(y_all)),
            y_all,
            groups=groups_all
        )
    )

    y_inner = y_all.iloc[inner_train_idx].reset_index(drop=True)
    groups_inner = groups_all.iloc[inner_train_idx].reset_index(drop=True)

    model_names = CANDIDATES[target]
    inner_predictions = [
        np.full(len(inner_train_idx), np.nan),
        np.full(len(inner_train_idx), np.nan)
    ]

    # Inner grouped CV: tune blend weights using training sites only
    inner_cv = GroupKFold(n_splits=4)

    for fold, (tr, val) in enumerate(
        inner_cv.split(np.zeros(len(y_inner)), y_inner, groups_inner),
        start=1
    ):
        for model_idx, (kind, feature_type) in enumerate(model_names):
            columns = TAB_FEATURES if feature_type == "tab" else MULTI_FEATURES

            X_train = get_features(
                feature_type, valid_indices[inner_train_idx[tr]], columns
            )
            X_val = get_features(
                feature_type, valid_indices[inner_train_idx[val]], columns
            )

            model = build_model(kind)
            model.fit(X_train, y_inner.iloc[tr])

            inner_predictions[model_idx][val] = model.predict(X_val)

        print(f"  Inner fold {fold}/4 completed")

    pred_a, pred_b = inner_predictions

    best_weight = 0.5
    best_inner_rmse = float("inf")

    for weight in np.arange(0, 1.001, 0.05):
        blend = weight * pred_a + (1 - weight) * pred_b
        score = np.sqrt(mean_squared_error(y_inner, blend))

        if score < best_inner_rmse:
            best_inner_rmse = score
            best_weight = weight

    # Fit both selected models on all inner-training sites
    holdout_predictions = []

    for kind, feature_type in model_names:
        columns = TAB_FEATURES if feature_type == "tab" else MULTI_FEATURES

        X_train = get_features(
            feature_type, valid_indices[inner_train_idx], columns
        )
        X_holdout = get_features(
            feature_type, valid_indices[holdout_idx], columns
        )

        model = build_model(kind)
        model.fit(X_train, y_inner)

        holdout_predictions.append(model.predict(X_holdout))

    final_prediction = (
        best_weight * holdout_predictions[0]
        + (1 - best_weight) * holdout_predictions[1]
    )

    y_holdout = y_all.iloc[holdout_idx]

    holdout_rmse = np.sqrt(
        mean_squared_error(y_holdout, final_prediction)
    )

    print(f"  Training sites: {groups_inner.nunique()}")
    print(f"  Holdout sites: {groups_all.iloc[holdout_idx].nunique()}")
    print(f"  Selected model A weight: {best_weight:.2f}")
    print(f"  Inner training OOF RMSE: {best_inner_rmse:.5f}")
    print(f"  Independent holdout RMSE: {holdout_rmse:.5f}")

    results09.append({
        "target": target,
        "model_a": model_names[0][0] + "_" + model_names[0][1],
        "model_b": model_names[1][0] + "_" + model_names[1][1],
        "weight_a": best_weight,
        "inner_oof_rmse": best_inner_rmse,
        "independent_holdout_rmse": holdout_rmse,
        "training_sites": groups_inner.nunique(),
        "holdout_sites": groups_all.iloc[holdout_idx].nunique()
    })

results09_df = pd.DataFrame(results09)

print("\n" + "=" * 75)
print("EXPERIMENT 09 FINAL RESULTS")
print("=" * 75)

display(results09_df.round(5))

print(
    "\nINDEPENDENT HOLDOUT MCRMSE:",
    round(results09_df["independent_holdout_rmse"].mean(), 5)
)

results09_df.to_csv(
    "/kaggle/working/aeroblind_experiment09_results.csv",
    index=False
)

print("\nSaved: aeroblind_experiment09_results.csv")
print(f"Elapsed time: {(time.time() - start_time) / 60:.1f} minutes")
