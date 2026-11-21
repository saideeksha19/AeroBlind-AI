# Source code

- `00_data_setup.py`: loads the official competition CSV files.
- `experiments/experiment_01.py` through `experiment_10.py`: original experiment cells.
- `run_all.py`: executes setup and all experiments sequentially in one shared namespace.

## Execution

Run `python src/run_all.py` in a Kaggle environment with the OBSCURA dataset attached and the dependencies installed.

The full pipeline includes image extraction and model training and may take several minutes. It is not intended to run against a local machine without the competition data.

The original notebook remains the primary research record.
