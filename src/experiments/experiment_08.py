# AeroBlind AI ? Experiment 08
# Extracted from notebook cell 14.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd
from sklearn.model_selection import GroupKFold
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import ExtraTreesRegressor
from sklearn.metrics import mean_squared_error
from catboost import CatBoostRegressor
import time

print("=" * 70)
print("AEROBLIND AI - EXPERIMENT 08")
print("TARGET-WISE MODEL BLENDING")
print("=" * 70)

# Best two candidates based on Experiments 06 and 07
candidates = {
    "t_ch4": [("ET_MULTI", "multi"), ("CB_TAB", "tab")],
    "t_no2": [("ET_TAB", "tab"), ("CB_MULTI", "multi")],
    "t_co": [("CB_MULTI", "multi"), ("ET_MULTI", "multi")],
    "t_aai": [("CB_MULTI", "multi"), ("ET_MULTI", "multi")],
    "t_firms": [("CB_MULTI", "multi"), ("ET_MULTI", "multi")]
}

TARGETS = list(candidates.keys())
tab_features = [
    c for c in train.columns
    if c not in ["sample_id", "site_key"] + TARGETS
]
img_features = [
    c for c in image_features.columns if c != "sample_id"
]
multi_features = tab_features + img_features

cv = GroupKFold(n_splits=5)
summary = []
oof_records = []
start_time = time.time()

def make_model(model_name):
    if model_name.startswith("ET"):
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

for target in TARGETS:
    print(f"\nTARGET: {target}")

    mask = train[target].notna()
    y = train.loc[mask, target].astype(float)
    groups = train.loc[mask, "site_key"]

    predictions = {
        name: np.full(len(y), np.nan)
        for name, _ in candidates[target]
    }

    for fold, (tr_idx, val_idx) in enumerate(
        cv.split(np.zeros(len(y)), y, groups), start=1
    ):
        for model_name, feature_type in candidates[target]:
            cols = tab_features if feature_type == "tab" else multi_features
            source = train if feature_type == "tab" else train_multi
            X = source.loc[mask, cols]

            model = make_model(model_name)
            model.fit(X.iloc[tr_idx], y.iloc[tr_idx])
            predictions[model_name][val_idx] = model.predict(
                X.iloc[val_idx]
            )

        print(f"  Fold {fold}/5 completed")

    names = list(predictions.keys())
    pred_a = predictions[names[0]]
    pred_b = predictions[names[1]]

    rmse_a = np.sqrt(mean_squared_error(y, pred_a))
    rmse_b = np.sqrt(mean_squared_error(y, pred_b))

    best_rmse = float("inf")
    best_weight = None

    for weight in np.arange(0, 1.001, 0.05):
        blended = weight * pred_a + (1 - weight) * pred_b
        score = np.sqrt(mean_squared_error(y, blended))
        if score < best_rmse:
            best_rmse = score
            best_weight = weight

    print(f"  {names[0]} RMSE: {rmse_a:.5f}")
    print(f"  {names[1]} RMSE: {rmse_b:.5f}")
    print(f"  Best blend weight for {names[0]}: {best_weight:.2f}")
    print(f"  Blended RMSE: {best_rmse:.5f}")

    summary.append({
        "target": target,
        "model_a": names[0],
        "model_a_rmse": rmse_a,
        "model_b": names[1],
        "model_b_rmse": rmse_b,
        "weight_model_a": best_weight,
        "blended_rmse": best_rmse
    })

    for i, sample_id in enumerate(train.loc[mask, "sample_id"]):
        oof_records.append({
            "sample_id": sample_id,
            "target": target,
            "model_a_prediction": pred_a[i],
            "model_b_prediction": pred_b[i],
            "weight_model_a": best_weight,
            "blended_prediction": (
                best_weight * pred_a[i]
                + (1 - best_weight) * pred_b[i]
            )
        })

summary_df = pd.DataFrame(summary)
oof_df = pd.DataFrame(oof_records)

print("\n" + "=" * 70)
print("EXPERIMENT 08 RESULTS")
print("=" * 70)
display(summary_df.round(5))

print(
    "\nBLENDED MCRMSE:",
    round(summary_df["blended_rmse"].mean(), 5)
)

summary_df.to_csv(
    "/kaggle/working/aeroblind_experiment08_results.csv",
    index=False
)
oof_df.to_csv(
    "/kaggle/working/aeroblind_experiment08_oof_predictions.csv",
    index=False
)

print("\nSaved both Experiment 08 result files.")
print(f"Elapsed time: {(time.time() - start_time) / 60:.1f} minutes")
