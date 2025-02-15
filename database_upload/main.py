import requests
from neo4j import GraphDatabase


def create_node(driver, paper):
    # retreiving information for each paper
    paper_title = paper["display_name"]
    paper_doi = paper["doi"]
    paper_id = paper["id"]
    summary = driver.execute_query(
    # creating a node in database
    "CREATE (:Paper {title: $title, doi: $doi, id: $id})",
        title=paper_title,
        doi=paper_doi,
        id=paper_id,  # Ensure the correct parameter name is used here
        database_="neo4j"
    )

# connecting to database here
URI = "bolt://localhost:7687/"
AUTH = ("neo4j", "dublin-poetic-texas-trust-libra-1811") #TODO: ADD YOUR OWN DATABASE PASSWORD HERE

with GraphDatabase.driver(URI, auth=AUTH) as driver:
    driver.verify_connectivity()
    print("Successfully connected to database")

    # getting papers from database
    response = requests.get("https://api.openalex.org/works?sample=20&select=display_name,doi,id,referenced_works")
    data = response.json()
    print(data["results"])

    # creating a node for each paper
    for paper in data["results"]:
        create_node(driver, paper)