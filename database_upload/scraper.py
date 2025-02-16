import pyalex
from pyalex import Works
import csv

# --- PyAlex configuration ---
pyalex.config.email = "lelezita2012@gmail.com"  # Your email for the polite pool

# --- Fetch arXiv works with Canadian institutions ---
# We filter on 'indexed_in' for "arxiv" and on the nested attribute authorships.institutions.country_code for "ca"

pages = (
    Works()
    .filter(indexed_in="arxiv", authorships={"institutions": {"country_code": "ca"}})
    .paginate(per_page=200, n_max=1000000)
)


papers = []  # To store paper data
arxiv_ids = set()  # To keep track of fetched paper IDs

i = 0

# For demonstration, we'll process just the first page
for page in pages:
    print(f"page {i}")
    i += 1
    for work in page:
        paper_id = work["id"]
        paper_doi = work.get("doi")
        count = work.get("cited_by_count")
        title = work.get("display_name") or work.get("title")
        refs = work.get("referenced_works", [])

        # Extract Canadian institution names from the authorships field
        canadian_universities = set()
        for authorship in work.get("authorships", []):
            for institution in authorship.get("institutions", []):
                if (
                    institution.get("country_code")
                    and institution.get("country_code", "").lower() == "ca"
                ):
                    name = institution.get("display_name")
                    if name:
                        canadian_universities.add(name)
        canadian_universities_str = "%".join(sorted(canadian_universities))

        papers.append(
            {
                "id": paper_id,
                "doi": paper_doi,
                "title": title,
                "refs": refs,
                "canadian_universities": canadian_universities_str,
                "count": count,
            }
        )
        arxiv_ids.add(paper_id)

print(f"Fetched {len(papers)} papers with Canadian institutions.")

# --- Write the results into a CSV file ---
csv_filename = "canadian_arxiv_papers.csv"
with open(csv_filename, "w", newline="", encoding="utf-8") as csvfile:
    fieldnames = ["id", "doi", "title", "references", "canadian_universities", "count"]
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()

    for paper in papers:
        refs_str = "%".join(paper["refs"]) if paper["refs"] else ""
        writer.writerow(
            {
                "id": paper["id"],
                "doi": paper["doi"],
                "title": paper["title"],
                "references": refs_str,
                "canadian_universities": paper["canadian_universities"],
                "count": paper["count"],
            }
        )

print(f"CSV file '{csv_filename}' created.")
