# AeroBlind AI ? original notebook data setup


from pathlib import Path
import pandas as pd
import numpy as np

# Locate the competition dataset
ROOT = Path("/kaggle/input")

train_paths = list(ROOT.rglob("train.csv"))
test_paths = list(ROOT.rglob("test.csv"))
submission_paths = list(ROOT.rglob("sample_submission.csv"))

assert train_paths, "train.csv not found. Check notebook inputs."
assert test_paths, "test.csv not found. Check notebook inputs."
assert submission_paths, "sample_submission.csv not found."

TRAIN_PATH = train_paths[0]
TEST_PATH = test_paths[0]
SUB_PATH = submission_paths[0]

DATA_DIR = TRAIN_PATH.parent

print("DATASET LOCATION:", DATA_DIR)

# Load only small CSV files
train = pd.read_csv(TRAIN_PATH)
test = pd.read_csv(TEST_PATH)
sample_submission = pd.read_csv(SUB_PATH)

TARGETS = ["t_ch4", "t_no2", "t_co", "t_aai", "t_firms"]

print("\nDATASET SHAPES")
print("Train:", train.shape)
print("Test:", test.shape)
print("Sample submission:", sample_submission.shape)

print("\nTRAIN COLUMNS")
print(train.columns.tolist())

print("\nTEST COLUMNS")
print(test.columns.tolist())

print("\nTARGET MISSINGNESS")
print(train[TARGETS].isna().mean().mul(100).round(2))

print("\nTARGET STATISTICS")
print(train[TARGETS].describe().round(3))

print("\nSITE INFORMATION")
print("Unique training sites:", train["site_key"].nunique())
print("Rows per site:")
print(train.groupby("site_key").size().describe())

print("\nFEATURE COUNT")
features = [
    c for c in test.columns
    if c != "sample_id"
]
print("Numerical feature count:", len(features))

print("\nIMAGE FILES")
image_dir = DATA_DIR / "images"

if image_dir.exists():
    image_count = sum(1 for _ in image_dir.glob("*.tif"))
    print("TIFF files:", image_count)
else:
    print("Image directory not found at expected location.")
    print("Inspect DATA_DIR for the actual image location.")

print("\nSUBMISSION FORMAT")
print(sample_submission.head())

print("\nINSPECTION COMPLETE")
