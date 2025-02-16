import pandas as pd
import csv

# File paths – adjust these as necessary
input_csv = "canadian_arxiv_papers.csv"
output_csv = "clean.csv"

# Read the CSV file using pandas.
# Use on_bad_lines='skip' to skip problematic rows.
df = pd.read_csv(input_csv, engine="python", on_bad_lines="skip")


# Define a function to escape double quotes in text fields
def escape_quotes(x):
    if isinstance(x, str):
        return x.replace('"', r"\"")
    return x


# Apply the escaping function to every cell in the DataFrame
df = df.applymap(escape_quotes)

# Write the fixed data to a new CSV file.
# Use quoting=csv.QUOTE_ALL so every field is wrapped in quotes,
# and set escapechar="\" so inner quotes are properly escaped.
df.to_csv(
    output_csv, index=False, quoting=csv.QUOTE_ALL, escapechar="\\", encoding="utf-8"
)

print(f"Fixed CSV file written to {output_csv}")
