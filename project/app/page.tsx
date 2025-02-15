import NetworkBackground from './components/networkBackground';
import LandingPanel from "./components/LandingPanel";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10" />

      {/* Network background */}
      <NetworkBackground />

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex items-center justify-center p-4">
        <LandingPanel />
      </div>
    </main>
  );
}
