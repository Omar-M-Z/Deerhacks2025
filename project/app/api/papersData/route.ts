import { NextRequest, NextResponse } from 'next/server';
import neo4j from 'neo4j-driver';

const NEO4J_URI = 'bolt://localhost:7687';
const NEO4J_USER = 'neo4j';
const NEO4J_PASSWORD = 'your_password';

// Create a Neo4j driver instance (reuse this in production)
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paperId = searchParams.get('id');
    if (!paperId) {
      return NextResponse.json({ error: 'Missing paper id parameter' }, { status: 400 });
    }

    // Open a new session
    const session = driver.session();
    const query = `
      MATCH (p:Paper {id: $paperId})
      OPTIONAL MATCH (p)--(neighbor)
      RETURN p, collect(neighbor) AS neighbors
    `;
    const result = await session.run(query, { paperId });
    await session.close();

    if (result.records.length === 0) {
      return NextResponse.json({ error: 'No paper found with that id' }, { status: 404 });
    }

    // Extract the paper node and neighbors
    const record = result.records[0];
    const paperNode = record.get('p').properties;
    const neighborNodes = record.get('neighbors').map((node: any) => node.properties);

    const data = { paper: paperNode, neighbors: neighborNodes };

    // Log the exact data output to the console
    console.log("Database result data:", JSON.stringify(data, null, 2));

    // Return the data as JSON
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error in GET /api/papersData:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
