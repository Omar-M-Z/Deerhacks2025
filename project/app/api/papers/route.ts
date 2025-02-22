import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Get search query from URL
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Read the papers.txt file
    const filePath = path.join(process.cwd(), 'papers.txt');
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Parse the papers with their IDs
    const papers = fileContent
      .split('\n')
      .filter(paper => paper.trim())
      .map(paper => {
        const [title, id] = paper.split('#');
        return {
          id: id,
          title: title.trim()
        };
      });

    // If there's a search query, filter the papers
    if (query) {
      const searchTerms = query.split(' ');
      const filteredPapers = papers.filter(paper =>
        searchTerms.every(term =>
          paper.title.toLowerCase().includes(term)
        )
      ).slice(0, 10);
      return NextResponse.json({ papers: filteredPapers });
    }

    // If no query, return first 10 papers
    return NextResponse.json({ papers: papers.slice(0, 10) });
  } catch (error) {
    console.error('Error reading papers:', error);
    return NextResponse.json(
      { error: 'Failed to load papers' },
      { status: 500 }
    );
  }
}
