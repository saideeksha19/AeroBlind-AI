# AeroBlind AI ? Experiment 03
# Extracted from notebook cell 9.
# Run through src/run_all.py in the Kaggle competition environment.


from pathlib import Path
import numpy as np

image_dir = DATA_DIR / "images"
sample_image = next(image_dir.glob("*.tif"))

print("=" * 60)
print("AEROBLIND AI - EXPERIMENT 03")
print("SATELLITE IMAGE METADATA INSPECTION")
print("=" * 60)

print("\nImage:", sample_image.name)

try:
    import rasterio

    with rasterio.open(sample_image) as src:
        print("\nIMAGE DIMENSIONS")
        print("Width:", src.width)
        print("Height:", src.height)
        print("Number of bands:", src.count)
        print("Data type:", src.dtypes)
        print("CRS:", src.crs)
        print("NoData value:", src.nodata)

        print("\nBAND DESCRIPTIONS")
        for i, description in enumerate(src.descriptions, start=1):
            print(f"Band {i}: {description}")

        print("\nBAND STATISTICS")
        for band in range(1, src.count + 1):
            arr = src.read(band, masked=True).astype("float32")
            valid = arr.compressed()

            if len(valid) > 0:
                print(
                    f"Band {band}: "
                    f"valid={len(valid)}, "
                    f"mean={np.mean(valid):.5f}, "
                    f"std={np.std(valid):.5f}, "
                    f"min={np.min(valid):.5f}, "
                    f"max={np.max(valid):.5f}"
                )
            else:
                print(f"Band {band}: No valid pixels")

        print("\nIMAGE INSPECTION SUCCESSFUL")

except ImportError:
    print("Rasterio is not installed.")
    print("Run: !pip install rasterio")
