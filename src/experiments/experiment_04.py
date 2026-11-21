# AeroBlind AI ? Experiment 04
# Extracted from notebook cell 10.
# Run through src/run_all.py in the Kaggle competition environment.


from pathlib import Path
import numpy as np
import rasterio
from collections import Counter

print("=" * 65)
print("AEROBLIND AI - EXPERIMENT 04")
print("SATELLITE IMAGE MAPPING AND QUALITY AUDIT")
print("=" * 65)

image_dir = DATA_DIR / "images"

# Build image lookup using filename stems
image_files = list(image_dir.glob("*.tif"))
image_lookup = {p.stem: p for p in image_files}

train_ids = set(train["sample_id"].astype(str))
test_ids = set(test["sample_id"].astype(str))
all_ids = train_ids | test_ids

# Check mapping coverage
train_missing = train_ids - image_lookup.keys()
test_missing = test_ids - image_lookup.keys()
extra_images = image_lookup.keys() - all_ids

print("\nIMAGE MAPPING")
print("Total TIFF images:", len(image_files))
print("Total unique train/test IDs:", len(all_ids))
print("Training IDs without images:", len(train_missing))
print("Test IDs without images:", len(test_missing))
print("Images without matching sample IDs:", len(extra_images))

# Inspect a sample of images
print("\nIMAGE QUALITY SAMPLE")

sample_ids = list(train["sample_id"].astype(str).head(10))

scl_counts = Counter()
cloud_means = []
reflectance_means = []

for sample_id in sample_ids:
    path = image_lookup.get(sample_id)

    if path is None:
        continue

    with rasterio.open(path) as src:
        arr = src.read()

        # Bands 1-12: spectral reflectance
        reflectance = arr[:12].astype(np.float32)
        reflectance_means.append(reflectance.mean())

        # Band 13: SCL categorical values
        scl = arr[12]
        scl_counts.update(
            Counter(scl.astype(int).ravel())
        )

        # Band 14: cloud probability
        cloud = arr[13].astype(np.float32)
        cloud_means.append(cloud.mean())

print("Images successfully inspected:", len(cloud_means))

if reflectance_means:
    print("Average spectral value:", round(
        float(np.mean(reflectance_means)), 3
    ))

if cloud_means:
    print("Average cloud probability:", round(
        float(np.mean(cloud_means)), 3
    ))

print("\nSCL CLASS PIXEL COUNTS")
for class_id, count in sorted(scl_counts.items()):
    print(f"Class {class_id}: {count}")

print("\n" + "=" * 65)
if not train_missing and not test_missing:
    print("SUCCESS: Every sample has a matching satellite image.")
else:
    print("WARNING: Some sample IDs have no matching image.")

print("EXPERIMENT 04 COMPLETE")
print("=" * 65)
