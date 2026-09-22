import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050711] text-slate-100 flex flex-col items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full p-6 rounded-lg bg-[#080d22] border border-purple-500/30 text-center space-y-4 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-400 flex items-center justify-center mx-auto text-purple-300">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-300 to-rose-300 uppercase tracking-widest">
            ANOMALIE HYPER-SPATIALE 404
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Ce secteur stellaire n&apos;est pas cartographié ou a été englouti par une singularité.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button variant="primary" className="w-full">
              Réinitialiser le Vecteur de Navigation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
