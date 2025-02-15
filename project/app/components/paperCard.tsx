import Link from 'next/link';
import { Network } from 'lucide-react';

interface Paper {
  id: number;
  title: string;
}

export function PaperCard({ paper, featured = false }: { paper: Paper; featured?: boolean }) {
  return (
    <div className="p-2"> {/* Increased padding to handle hover effect */}
      <Link
        href={`/map?id=${paper.id}`}
        className={`block p-6 rounded-lg border border-gray-200 
          transition-all duration-300 ease-out
          ${featured
            ? 'bg-gradient-to-br from-blue-50 to-white hover:shadow-xl hover:scale-105 hover:border-blue-200'
            : 'bg-white hover:shadow-lg hover:border-blue-200'
          }
          transform hover:-translate-y-1`}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {paper.title}
            </h3>
          </div>
          <Network className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
        </div>
      </Link>
    </div>
  );
}

export function FeaturedGrid({ papers }: { papers: Paper[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full overflow-y-auto overflow-x-hidden p-4">
      {papers.map((paper, index) => (
        <div
          key={paper.id}
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <PaperCard paper={paper} featured={true} />
        </div>
      ))}
    </div>
  );
}

export function SearchResults({ papers }: { papers: Paper[] }) {
  return (
    <div className="space-y-4 h-full overflow-y-auto overflow-x-hidden">
      {papers.map((paper, index) => (
        <div
          key={paper.id}
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <PaperCard paper={paper} />
        </div>
      ))}
    </div>
  );
}
