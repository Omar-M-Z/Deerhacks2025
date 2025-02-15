import PaperSearch from './components/PaperSearch';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Research Paper Search
        </h1>
        <PaperSearch />
      </div>
    </main>
  );
}
