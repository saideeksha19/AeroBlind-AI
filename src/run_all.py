"""Run the original AeroBlind AI experiments sequentially.

Run inside Kaggle with the OBSCURA competition dataset attached.
This preserves shared variables between the original notebook cells.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
EXPERIMENTS = ROOT / "experiments"

namespace = {
    "__name__": "__main__",
    "display": print,
}

files = [ROOT / "00_data_setup.py"] + [
    EXPERIMENTS / f"experiment_{i:02d}.py"
    for i in range(1, 11)
]

for path in files:
    print("\n" + "=" * 75)
    print("RUNNING:", path.name)
    print("=" * 75)
    code = path.read_text(encoding="utf-8-sig")
    exec(compile(code, str(path), "exec"), namespace)

print("\nALL AEROBLIND AI EXPERIMENTS FINISHED.")
