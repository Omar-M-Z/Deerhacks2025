import csv


if __name__ == "__main__":
    # make a set of all nodes from this data set
    nodes = {}
    with open('clean5.csv', mode='r', newline='', encoding='utf-8') as inFile:
        reader = csv.reader(inFile)
        for row in reader:
            nodes[(row[0])] = (row[1], row[2], row[4], row[5])
        print(len(nodes))

    # add a node and one of its references to set of edges if that reference is found in set of nodes above  
    with open('clean5.csv', mode='r', newline='', encoding='utf-8') as inFile:
        reader = csv.reader(inFile)
        edges = set()
        for row in reader:
            for ref in row[3].split('%'):
                if (ref[21:] in nodes):
                    other = nodes[ref[21:]]
                    edges.add((row[0], row[1], row[2], row[4], row[5], ref[21:], other[0], other[1], other[2], other[3]))
        edges = list(edges)
        print(len(edges))

    # write the set of edges in format for neo4j
    with open('edges.csv', 'w', newline='', encoding='utf-8') as outFile:
        writer = csv.writer(outFile)
        writer.writerow(['id1','doi1','title1','canadian_universities1','count1','id2','doi2','title2','canadian_universities2','count2'])
        writer.writerows(edges)
        