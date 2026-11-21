# AeroBlind AI ? Experiment 10
# Extracted from notebook cell 16.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd
import time

from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.ensemble import ExtraTreesRegressor
from catboost import CatBoostRegressor

print("=" * 75)
print("AEROBLIND AI - EXPERIMENT 10")
print("FINAL MODEL TRAINING AND TEST PREDICTION")
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

# Weights selected using training-site OOF predictions in Experiment 09
FINAL_CONFIG = {
    "t_ch4": ("ET", "multi", "CB", "tab", 0.70),
    "t_no2": ("ET", "tab", "CB", "multi", 0.55),
    "t_co": ("CB", "multi", "ET", "multi", 0.90),
    "t_aai": ("CB", "multi", "ET", "multi", 1.00),
    "t_firms": ("CB", "multi", "ET", "multi", 0.90)
}

def build_final_model(kind):
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

predictions = pd.DataFrame({
    "sample_id": test["sample_id"].values
})

start_time = time.time()

for target in TARGETS:
    print(f"\nTraining final models for {target}...")

    kind_a, type_a, kind_b, type_b, weight_a = FINAL_CONFIG[target]

    y = train[target]
    mask = y.notna()

    y_train = y.loc[mask].astype(float)

    cols_a = TAB_FEATURES if type_a == "tab" else MULTI_FEATURES
    cols_b = TAB_FEATURES if type_b == "tab" else MULTI_FEATURES

    source_a = train if type_a == "tab" else train_multi
    test_source_a = test if type_a == "tab" else test_multi

    X_a = source_a.loc[mask, cols_a].copy()
    X_test_a = test_source_a[cols_a].copy()

    model_a = build_final_model(kind_a)
    model_a.fit(X_a, y_train)

    pred_a = model_a.predict(X_test_a)

    if weight_a < 1.0:
        source_b = train if type_b == "tab" else train_multi
        test_source_b = test if type_b == "tab" else test_multi

        X_b = source_b.loc[mask, cols_b].copy()
        X_test_b = test_source_b[cols_b].copy()

        model_b = build_final_model(kind_b)
        model_b.fit(X_b, y_train)

        pred_b = model_b.predict(X_test_b)
    else:
        pred_b = pred_a.copy()

    final_pred = weight_a * pred_a + (1 - weight_a) * pred_b

    predictions[target] = final_pred

    print(f"  Model A: {kind_a}_{type_a}")
    print(f"  Model B: {kind_b}_{type_b}")
    print(f"  Blend weight A: {weight_a:.2f}")
    print(f"  Training rows: {len(y_train)}")
    print(f"  Test predictions: {len(final_pred)}")
    print(f"  Prediction range: {final_pred.min():.5f} to {final_pred.max():.5f}")

# Preserve exact sample submission order and columns
submission = sample_submission[["sample_id"]].merge(
    predictions,
    on="sample_id",
    how="left",
    validate="one_to_one"
)

submission = submission[sample_submission.columns]

print("\n" + "=" * 75)
print("FINAL SUBMISSION VALIDATION")
print("=" * 75)

print("Submission shape:", submission.shape)
print("Expected shape:", sample_submission.shape)
print("Missing values:", int(submission[TARGETS].isna().sum().sum()))
print("Duplicate sample IDs:", int(submission["sample_id"].duplicated().sum()))

assert submission.shape == sample_submission.shape
assert submission["sample_id"].equals(sample_submission["sample_id"])
assert submission[TARGETS].notna().all().all()
assert np.isfinite(submission[TARGETS].to_numpy()).all()

output_path = "/kaggle/working/submission.csv"
submission.to_csv(output_path, index=False)

print("\nSUBMISSION PREVIEW:")
display(submission.head(10))

print("\nFINAL FILE SAVED:", output_path)
print("File size (KB):", round(
    __import__("os").path.getsize(output_path) / 1024, 2
))
print(f"Total elapsed time: {(time.time() - start_time) / 60:.2f} minutes")

print("\nEXPERIMENT 10 COMPLETED SUCCESSFULLY")
