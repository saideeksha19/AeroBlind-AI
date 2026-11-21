# AeroBlind AI ? Experiment 05
# Extracted from notebook cell 11.
# Run through src/run_all.py in the Kaggle competition environment.


import numpy as np
import pandas as pd
import rasterio
from pathlib import Path
import time

print("=" * 70)
print("AEROBLIND AI - EXPERIMENT 05")
print("MULTIMODAL SATELLITE FEATURE EXTRACTION")
print("=" * 70)

image_dir = DATA_DIR / "images"
image_files = sorted(image_dir.glob("*.tif"))

records = []
start_time = time.time()

SCL_CLASSES = list(range(12))

for i, image_path in enumerate(image_files, start=1):

    with rasterio.open(image_path) as src:
        if src.count != 14:
            raise ValueError(
                f"Expected 14 bands, found {src.count}: {image_path.name}"
            )

        if src.width != 384 or src.height != 384:
            raise ValueError(
                f"Expected 384x384 image, found "
                f"{src.width}x{src.height}: {image_path.name}"
            )

        arr = src.read()

    row = {"sample_id": image_path.stem}

    # ------------------------------------------------
    # 1. SPECTRAL FEATURES: BANDS 1-12
    # ------------------------------------------------
    for band_idx in range(12):

        band = arr[band_idx].astype(np.float32)

        prefix = f"img_b{band_idx + 1}"

        row[f"{prefix}_mean"] = float(np.mean(band))
        row[f"{prefix}_std"] = float(np.std(band))
        row[f"{prefix}_p10"] = float(np.percentile(band, 10))
        row[f"{prefix}_p90"] = float(np.percentile(band, 90))

    # ------------------------------------------------
    # 2. SCENE CLASSIFICATION LAYER: BAND 13
    # ------------------------------------------------
    scl = arr[12].astype(np.uint8)
    scl_total = scl.size

    for class_id in SCL_CLASSES:
        row[f"scl_class_{class_id}_frac"] = float(
            np.count_nonzero(scl == class_id) / scl_total
        )

    # ------------------------------------------------
    # 3. CLOUD PROBABILITY: BAND 14
    # ------------------------------------------------
    cloud = arr[13].astype(np.float32)

    row["cloud_mean"] = float(np.mean(cloud))
    row["cloud_std"] = float(np.std(cloud))
    row["cloud_p90"] = float(np.percentile(cloud, 90))

    for threshold in [20, 40, 60, 80]:
        row[f"cloud_frac_above_{threshold}"] = float(
            np.mean(cloud > threshold)
        )

    records.append(row)

    if i % 250 == 0 or i == len(image_files):
        elapsed = time.time() - start_time

        print(
            f"Processed {i}/{len(image_files)} images | "
            f"Elapsed: {elapsed / 60:.1f} minutes"
        )

# ------------------------------------------------
# 4. CREATE FEATURE TABLE
# ------------------------------------------------
image_features = pd.DataFrame(records)

print("\n" + "=" * 70)
print("FEATURE EXTRACTION SUMMARY")
print("=" * 70)

print("Images processed:", len(image_features))
print("Image feature columns:", len(image_features.columns) - 1)
print("Feature table shape:", image_features.shape)

# Check duplicate IDs
print(
    "Duplicate image IDs:",
    image_features["sample_id"].duplicated().sum()
)

# Check missing feature values
feature_cols = [
    c for c in image_features.columns
    if c != "sample_id"
]

print(
    "Missing feature values:",
    image_features[feature_cols].isna().sum().sum()
)

# ------------------------------------------------
# 5. JOIN WITH TRAIN AND TEST
# ------------------------------------------------
train_multi = train.merge(
    image_features,
    on="sample_id",
    how="left",
    validate="one_to_one"
)

test_multi = test.merge(
    image_features,
    on="sample_id",
    how="left",
    validate="one_to_one"
)

print("\nMULTIMODAL DATASET SHAPES")
print("Training:", train_multi.shape)
print("Testing:", test_multi.shape)

print(
    "Missing training image features:",
    train_multi[feature_cols].isna().sum().sum()
)

print(
    "Missing testing image features:",
    test_multi[feature_cols].isna().sum().sum()
)

# ------------------------------------------------
# 6. SAVE FEATURES FOR REUSE
# ------------------------------------------------
output_path = Path("/kaggle/working/aeroblind_image_features.csv")

image_features.to_csv(output_path, index=False)

print("\nSaved image features:", output_path)

print("\nFEATURE SAMPLE")
display(image_features.head())

print("\nEXPERIMENT 05 COMPLETE")
print("=" * 70)

