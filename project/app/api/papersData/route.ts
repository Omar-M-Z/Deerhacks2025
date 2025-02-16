import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const NEO4J_URI = 'bolt://localhost:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'your_password';

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('id');
    const depthParam = searchParams.get('depth') || '1';
    const depth = Number(depthParam);

    if (!paperId) {
      return NextResponse.json({ error: 'Missing paper id parameter' }, { status: 400 });
    }

    // Open a new session
    const session = driver.session();

    // Query to fetch nodes and relationships, returning each relation with its two endpoints
    const query = `
      MATCH (startNode)-[*1..${depth}]-(neighbor)
      WHERE startNode.id = $paperId
      WITH COLLECT(DISTINCT startNode) + COLLECT(DISTINCT neighbor) AS nodes
      UNWIND nodes AS n1
      MATCH (n1)-[rel]-(n2)
      WHERE n2 IN nodes
      WITH nodes, rel, n1, n2
      // Order the endpoints to avoid duplicates
      WITH nodes, rel, 
           CASE WHEN n1.id <= n2.id THEN n1 ELSE n2 END AS nodeA,
           CASE WHEN n1.id <= n2.id THEN n2 ELSE n1 END AS nodeB
      RETURN nodes, COLLECT(DISTINCT { relation: rel, from: nodeA, to: nodeB }) AS rels
    `;

    const result = await session.run(query, { paperId });
    await session.close();

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'No paper found with that id' }, { status: 404 });
    }

    const record = result.records[0];

    // Extract nodes from the record.
    const nodes = record.get('nodes').map((node: any) => node.properties);

    // Map relationships into a tuple [from, to] for each relation.
    const relations = record.get('rels').map((item: any) => {
      return [item.from.properties.id, item.to.properties.id];
    });

    // Identify the center paper using the paperId.
    const centerPaper = nodes.find((node: any) => node.id === paperId);

    const data = { centerPaper, nodes, relations };

    console.log("Database result data:", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in GET /api/papersData:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
