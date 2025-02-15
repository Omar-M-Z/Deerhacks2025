import Link from 'next/link';

interface Paper {
  id: number;
  title: string;
}

// Updated PaperCard component with link to map page
export function PaperCard({ paper, featured = false }: { paper: Paper; featured?: boolean }) {
  return (
    <Link
      href={`/map?id=${paper.id}`}
      className={`block p-6 rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow
        ${featured ? 'bg-gradient-to-br from-blue-50 to-white' : 'bg-white'}`}
    >
      <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{paper.title}</h3>
    </Link>
  );
}

// Updated FeaturedGrid component
export function FeaturedGrid({ papers }: { papers: Paper[] }) {
  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} featured={true} />
      ))}
    </div>
  );
}

// Updated SearchResults component
export function SearchResults({ papers }: { papers: Paper[] }) {
  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} />
      ))}
    </div>
  );
}
