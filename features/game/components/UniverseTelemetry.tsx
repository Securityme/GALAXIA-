'use client';

import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { AvatarPortrait } from '@/components/ui/AvatarPortrait';
import { COUNCIL_MINISTERS_CATALOG } from '@/features/lore/councilMinisters';
import { CouncilPoleId } from '@/types/config';
import { 
  PLANETARY_BUILDINGS_CATALOG, 
  PlanetaryBuildingDefinition,
  calculateDynamicBuildingCost,
  calculateDynamicBuildingOutput
} from '@/features/database/planetaryBuildingsCatalog';
import { 
  PLANETARY_BIOMES_CATALOG, 
  PlanetaryBiomeDefinition 
} from '@/features/database/planetaryBiomesCatalog';
import { 
  INTERSTELLAR_FACTIONS_CATALOG, 
  ASTRA_MODULES_CATALOG 
} from '@/features/database/factionsCatalog';
import { 
  INITIAL_MULTI_SCALE_TOPOLOGY, 
  DimensionScale,
  MultiScaleDimension 
} from '@/features/game/scales/multiScaleTopology';
import { 
  Users, 
  Shield, 
  Globe, 
  Zap, 
  Coins, 
  Heart, 
  Activity, 
  Compass, 
  Cpu, 
  Crosshair, 
  Anchor, 
  Flame, 
  Layers, 
  CheckCircle2, 
  FlaskConical, 
  FileText, 
  Database, 
  Plus, 
  Hammer, 
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UniverseTelemetryProps {
  onInspectLeader?: () => void;
  onInspectCouncilMember?: (poleId: CouncilPoleId) => void;
  onOpenTechMatrix?: () => void;
}

export const UniverseTelemetry: React.FC<UniverseTelemetryProps> = ({
  onInspectLeader,
  onInspectCouncilMember,
  onOpenTechMatrix
}) => {
  const [activeTab, setActiveTab] = useState<'governance' | 'astra' | 'universe' | 'database'>('governance');
  const [selectedColonyForBuild, setSelectedColonyForBuild] = useState<string | null>(null);
  const [dbCategory, setDbCategory] = useState<'buildings' | 'biomes' | 'factions' | 'modules'>('buildings');
  const [dbTierFilter, setDbTierFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScale, setSelectedScale] = useState<DimensionScale>('meso_stellar');

  const { 
    resources, 
    leader, 
    astra, 
    council, 
    colonies, 
    eraId, 
    constructBuildingOnColony,
    upgradeColonyBuilding,
    unlockedTechs,
    constructionQueue,
    cancelConstructionProject
  } = useGameStore();

  const councilPoles = Object.values(council);

  return (
    <div className="flex flex-col h-full bg-[#060b18]/90 border border-cyan-500/25 rounded-md overflow-hidden shadow-[0_0_20px_rgba(0,243,255,0.06)]">
      
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#050914] border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-xs bg-cyan-400 border border-cyan-300 shadow-[0_0_8px_rgba(0,243,255,0.8)]" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-300">
            FENÊTRE 1 : TÉLÉMÉTRIE & BASES DE DONNÉES DE L’UNIVERS
          </h2>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
            SYNCHRONISÉ
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
          <span>CYCLE {resources.turn}</span>
          <span className="text-cyan-400 font-semibold">{eraId.toUpperCase()}</span>
        </div>
      </div>

      {/* Global Quick Telemetry HUD Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 p-3 bg-[#080f24]/90 border-b border-cyan-500/20 font-mono text-xs">
        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <Coins className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">CRÉDITS</div>
            <div className="text-sm font-bold text-amber-300">{resources.credits} ₢</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">ÉNERGIE FLUX</div>
            <div className="text-sm font-bold text-cyan-300">{resources.energy} GW</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <Heart className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">RATIONS VIVRES</div>
            <div className="text-sm font-bold text-emerald-300">{resources.food} kR</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <Activity className="w-4 h-4 text-sky-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">MINÉRAUX</div>
            <div className="text-sm font-bold text-sky-300">{resources.minerals} kT</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <FlaskConical className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">R&amp;D FLUX</div>
            <div className="text-sm font-bold text-purple-300">{resources.researchPoints}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <Users className="w-4 h-4 text-teal-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">POPULATION</div>
            <div className="text-sm font-bold text-teal-300">{(resources.population / 1000).toFixed(1)}k</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-cyan-500/20">
          <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">SÉCURITÉ SECTEUR</div>
            <div className="text-sm font-bold text-indigo-300">{resources.sectorSecurity}%</div>
          </div>
        </div>
      </div>

      {/* 4 Tabs Navigation Strip */}
      <div className="flex items-center border-b border-cyan-500/20 bg-[#070d1e] px-3 font-mono text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('governance')}
          className={`flex items-center gap-2 px-3 py-2.5 border-b-2 font-bold tracking-wider transition-all shrink-0 ${
            activeTab === 'governance'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          GOUVERNANCE
        </button>

        <button
          onClick={() => setActiveTab('astra')}
          className={`flex items-center gap-2 px-3 py-2.5 border-b-2 font-bold tracking-wider transition-all shrink-0 ${
            activeTab === 'astra'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          ASTRA & FLOTTE
        </button>

        <button
          onClick={() => setActiveTab('universe')}
          className={`flex items-center gap-2 px-3 py-2.5 border-b-2 font-bold tracking-wider transition-all shrink-0 ${
            activeTab === 'universe'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          COLONIES & VILLES
        </button>

        <button
          onClick={() => setActiveTab('database')}
          className={`flex items-center gap-2 px-3 py-2.5 border-b-2 font-bold tracking-wider transition-all shrink-0 ${
            activeTab === 'database'
              ? 'border-amber-400 text-amber-300 bg-amber-500/10'
              : 'border-transparent text-slate-400 hover:text-amber-300'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          CODEX & BASES DE DONNÉES
        </button>
      </div>

      {/* Tab Panels Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
        
        {/* ================= TAB 1: GOUVERNANCE & UNION ================= */}
        {activeTab === 'governance' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Leader Dossier Card */}
            <div className="p-4 rounded bg-[#091126] border border-cyan-500/25">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <AvatarPortrait
                    id={leader.avatarId || 'leader_vance'}
                    name={leader.name}
                    neonColor="#00f3ff"
                    size="md"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">
                      {leader.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{leader.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onInspectLeader}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors text-[10px] font-bold"
                  >
                    <FileText className="w-3 h-3" />
                    DOSSIER COMPLET
                  </button>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                    STATUT : ACTIF
                  </span>
                </div>
              </div>

              {/* Passive Traits */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5 font-semibold">
                  Traits Psychologiques &amp; Politiques Passifs :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {leader.traits.map((t) => (
                    <div key={t.id} className="p-2.5 rounded bg-[#060c1d] border border-slate-700/60">
                      <div className="flex items-center justify-between text-cyan-300 font-semibold text-xs mb-1">
                        <span>{t.name}</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 mb-1">{t.description}</p>
                      <span className="text-[10px] text-emerald-400 font-bold">{t.passiveBonus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Executive Council (6 Poles) */}
            <div className="p-4 rounded bg-[#091126] border border-cyan-500/25">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  CONSEIL EXÉCUTIF AUX 6 PÔLES MINISTÉRIELS
                </h3>
                <span className="text-[10px] text-slate-400">Équilibre d&apos;Influence &amp; Loyauté</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {councilPoles.map((member) => {
                  const catalogData = COUNCIL_MINISTERS_CATALOG[member.poleId];
                  const neon = catalogData?.signatureNeon || member.neonColor || '#00f3ff';

                  return (
                    <div
                      key={member.poleId}
                      className="p-2.5 rounded bg-[#050a18] border border-slate-700/50 hover:border-cyan-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <AvatarPortrait
                          id={member.avatarId || `minister_${member.poleId}`}
                          name={member.name}
                          neonColor={neon}
                          size="sm"
                        />
                        <div className="overflow-hidden flex-1">
                          <h4 className="text-xs font-bold text-slate-200 truncate">{member.name}</h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: neon }}>
                            {member.poleId}
                          </span>
                        </div>
                      </div>

                      {/* Loyalty Bar */}
                      <div className="space-y-1 mb-2">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-400">Loyauté :</span>
                          <span className="font-bold" style={{ color: member.loyalty < 40 ? '#f43f5e' : neon }}>
                            {member.loyalty}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${member.loyalty}%`,
                              backgroundColor: member.loyalty < 40 ? '#f43f5e' : neon
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-[9px] text-slate-400 truncate max-w-[130px]">
                          {member.specialty}
                        </span>
                        <button
                          onClick={() => onInspectCouncilMember?.(member.poleId)}
                          className="text-[9px] font-bold text-cyan-400 hover:underline"
                        >
                          Dossier &gt;
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ASTRA & FLOTTE ================= */}
        {activeTab === 'astra' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded bg-[#091126] border border-cyan-500/25">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Anchor className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wide">
                      {astra.name}
                    </h3>
                    <p className="text-[10px] text-slate-400">Vaisseau-Monde Métropolitain • Classe Arche Super-Lourde</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  RÉACTEURS : {astra.fusionReactors} MW
                </span>
              </div>

              {/* Hull & Shields Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded bg-[#050a18] border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-cyan-400" /> INTÉGRITÉ DE COQUE
                    </span>
                    <span className="text-xs font-bold text-cyan-300">
                      {astra.hullCurrent} / {astra.hullMax} HP
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(0, Math.min(100, (astra.hullCurrent / astra.hullMax) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded bg-[#050a18] border border-slate-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" /> BOUCLIERS DÉFLECTEURS
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {astra.structuralShields}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${astra.structuralShields}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Complement */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-[#050a18] border border-slate-700/40">
                  <div className="text-[10px] text-slate-400">CONDENSATEURS FTL</div>
                  <div className="text-sm font-bold text-purple-300 mt-0.5">{astra.ftlCapacitors}% CHARGE</div>
                </div>

                <div className="p-2.5 rounded bg-[#050a18] border border-slate-700/40">
                  <div className="text-[10px] text-slate-400">ESCADRES DE COMBAT</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">{astra.combatSquadrons} Escadrons</div>
                </div>

                <div className="p-2.5 rounded bg-[#050a18] border border-slate-700/40">
                  <div className="text-[10px] text-slate-400">DRONES DE MINAGE</div>
                  <div className="text-sm font-bold text-emerald-300 mt-0.5">{astra.miningDrones} Essaims</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: UNIVERS 4X & COLONIES ================= */}
        {activeTab === 'universe' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Multi-Scale Dimension Topology Header */}
            <div className="p-3.5 rounded bg-[#091126] border border-cyan-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-xs">
                    TOPOLOGIE MULTI-ÉCHELLES &amp; DIMENSIONS INVIOLABLES
                  </span>
                </div>

                {/* Scale buttons */}
                <div className="flex items-center bg-[#050914] rounded border border-slate-700/80 p-0.5">
                  <button
                    onClick={() => setSelectedScale('macro_galactic')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      selectedScale === 'macro_galactic'
                        ? 'bg-purple-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-purple-300'
                    }`}
                  >
                    1. Macro-Galactique
                  </button>
                  <button
                    onClick={() => setSelectedScale('meso_stellar')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      selectedScale === 'meso_stellar'
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-cyan-300'
                    }`}
                  >
                    2. Méso-Système
                  </button>
                  <button
                    onClick={() => setSelectedScale('micro_planetary')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      selectedScale === 'micro_planetary'
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'text-slate-400 hover:text-emerald-300'
                    }`}
                  >
                    3. Micro-Planétaire
                  </button>
                </div>
              </div>

              {/* Multi-scale dimension node preview if Macro or Meso is active */}
              {selectedScale === 'macro_galactic' && (
                <div className="p-3 rounded bg-[#040816] border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">
                      Topologie Macro-Galactique : Secteurs Stellaires &amp; Quadrants
                    </span>
                    <span className="text-[10px] text-purple-400">
                      {INITIAL_MULTI_SCALE_TOPOLOGY.macroSectors.length} Secteurs Cartographiés
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Cartographie globale des hyper-routes, des fronts stellaires et des zones d&apos;instabilité spatio-temporelle.
                  </p>
                  
                  {/* Macro Sectors Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                    {INITIAL_MULTI_SCALE_TOPOLOGY.macroSectors.map((sector) => (
                      <div key={sector.id} className="p-2.5 rounded bg-[#070e24] border border-purple-500/30 text-[10px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-300">{sector.name}</span>
                          <span className="text-[9px] px-1 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30">
                            {sector.quadrant}
                          </span>
                        </div>
                        <p className="text-slate-400 line-clamp-2">{sector.loreAnchor}</p>
                        <div className="text-[9px] text-amber-300 flex items-center justify-between pt-1 border-t border-slate-800/80">
                          <span>Menace : {(sector.threatCoefficient * 100).toFixed(0)}%</span>
                          <span className="text-cyan-400">{sector.stellarDensity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedScale === 'meso_stellar' && (
                <div className="p-3 rounded bg-[#040816] border border-cyan-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300">
                      Topologie Méso-Stellaire : Orbites &amp; Zones de Flux Solaire
                    </span>
                    <span className="text-[10px] text-cyan-400">
                      {INITIAL_MULTI_SCALE_TOPOLOGY.mesoOrbits.length} Orbites Système
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Positionnement orbital de la flotte ASTRA et surveillance des gradients de radiation et de flux d&apos;énergie.
                  </p>
                  
                  {/* Meso Orbits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
                    {INITIAL_MULTI_SCALE_TOPOLOGY.mesoOrbits.map((orbit) => (
                      <div key={orbit.orbitIndex} className="p-2.5 rounded bg-[#070e24] border border-cyan-500/30 text-[10px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">{orbit.zoneName}</span>
                          {orbit.astraDocked && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                              ASTRA PRÉSENT
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          Ressources : {orbit.dominantResources.join(', ')}
                        </div>
                        <div className="text-[9px] text-amber-300 flex items-center justify-between pt-1 border-t border-slate-800/80">
                          <span>Radiation : {orbit.radiationHazard}</span>
                          <span className="text-cyan-400">Flux : {orbit.solarFlux}x</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Empire-wide Construction Queue (Chantiers en cours) */}
            {constructionQueue.length > 0 && (
              <div className="p-4 rounded bg-[#07132a] border border-amber-500/40 shadow-[0_0_20px_rgba(255,183,0,0.08)] space-y-3">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-amber-400 animate-bounce" />
                    <h3 className="text-xs font-bold uppercase text-amber-300 tracking-wider">
                      CHANTIERS PLANÉTAIRES EN COURS D&apos;ÉRECTION ({constructionQueue.length} PROJETS)
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30 text-amber-300">
                    GESTION DES TOURS AUTOMATISÉE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {constructionQueue.map((project) => {
                    const progressPercent = Math.round(
                      ((project.totalTurns - project.turnsRemaining) / project.totalTurns) * 100
                    );

                    return (
                      <div key={project.id} className="p-3 rounded bg-[#040916] border border-amber-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-xs text-white">{project.buildingName}</span>
                            <span className="text-[10px] text-cyan-400 ml-2">sur {project.colonyName}</span>
                          </div>
                          <span className="text-[10px] font-bold text-amber-300 px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/30">
                            {project.turnsRemaining} {project.turnsRemaining > 1 ? 'cycles restants' : 'cycle restant'}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(5, progressPercent)}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-slate-400">
                            <span>Avancement : {progressPercent}%</span>
                            <span>Durée totale : {project.totalTurns} cycles</span>
                          </div>
                        </div>

                        {/* Projected Bonus */}
                        <div className="text-[10px] text-emerald-400 bg-emerald-950/20 p-1.5 rounded border border-emerald-500/20">
                          Rendement projeté : {Object.entries(project.projectedBonus || {})
                            .filter(([_, val]) => val !== undefined && val > 0)
                            .map(([key, val]) => `+${val} ${key}`)
                            .join(' • ') || 'Bonus infrastructurel local'}
                        </div>

                        {project.aiSynergyNarrative && (
                          <div className="text-[9px] text-slate-400 italic">
                            {project.aiSynergyNarrative}
                          </div>
                        )}

                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => cancelConstructionProject(project.id)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 hover:underline"
                          >
                            Annuler le chantier (Remboursement partiel)
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colonies List */}
            {colonies.map((colony) => {
              const totalBuildingsAcrossEmpire = colonies.reduce((sum, c) => sum + c.buildings.length, 0);

              return (
              <div key={colony.id} className="p-4 rounded bg-[#091126] border border-cyan-500/25">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                        {colony.name}
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        Type : {colony.planetType} • Orbite : {colony.orbitZone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                      POP : {colony.population.toLocaleString()} HAB.
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedColonyForBuild(selectedColonyForBuild === colony.id ? null : colony.id)}
                      className="text-xs py-1"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Construire Bâtiment
                    </Button>
                  </div>
                </div>

                {/* Construction Drawer if open */}
                {selectedColonyForBuild === colony.id && (
                  <div className="p-3 mb-4 rounded bg-[#040817] border border-amber-500/30 animate-in fade-in space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Hammer className="w-3.5 h-3.5 text-amber-400" />
                        CATALOGUE DE CONSTRUCTION DYNAMIQUE (LOGISTIQUE ET SYNERGIES IA) :
                      </span>
                      <button
                        onClick={() => setSelectedColonyForBuild(null)}
                        className="text-[10px] text-slate-400 hover:text-rose-300"
                      >
                        ✕ Fermer
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {PLANETARY_BUILDINGS_CATALOG.slice(0, 6).map((bDef) => {
                        const dynamicCost = calculateDynamicBuildingCost(
                          bDef,
                          colony.buildings.length,
                          totalBuildingsAcrossEmpire,
                          colony.planetType
                        );
                        const dynamicOutput = calculateDynamicBuildingOutput(
                          bDef,
                          colony.planetType,
                          resources.morale
                        );
                        const canAfford = resources.minerals >= dynamicCost.minerals && resources.credits >= dynamicCost.credits;

                        return (
                          <div key={bDef.id} className="p-2.5 rounded bg-[#08122d] border border-slate-700 text-[10px] space-y-1.5 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200">{bDef.name}</span>
                                <span className="text-[9px] px-1 rounded bg-slate-800 text-amber-300">T{bDef.tier}</span>
                              </div>
                              <p className="text-slate-400 line-clamp-1">{bDef.description}</p>
                              
                              <div className="text-slate-300 font-mono pt-1">
                                Coût : <strong className="text-cyan-300">{dynamicCost.minerals} Min</strong>, <strong className="text-amber-300">{dynamicCost.credits} ₢</strong>
                              </div>
                              <div className="text-[9px] text-slate-400">
                                Temps de chantier : <strong className="text-amber-300">{dynamicCost.constructionTurns} {dynamicCost.constructionTurns > 1 ? 'cycles' : 'cycle'}</strong>
                              </div>
                              <div className="text-[9px] text-emerald-400 font-mono mt-0.5">
                                {dynamicOutput.aiSynergyText}
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant={canAfford ? 'primary' : 'secondary'}
                              disabled={!canAfford}
                              onClick={() => {
                                constructBuildingOnColony(colony.id, bDef.id);
                                setSelectedColonyForBuild(null);
                              }}
                              className="w-full text-xs py-1 h-6 mt-2"
                            >
                              Lancer Chantier ({dynamicCost.constructionTurns}t)
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3-Level Production Tables */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded bg-[#050a18] border border-cyan-500/20">
                      <div className="text-[10px] text-cyan-400 font-bold">1. GLOBAL UNION</div>
                      <p className="text-[11px] text-slate-300 mt-1">+45 Crédits / cycle</p>
                    </div>

                    <div className="p-2.5 rounded bg-[#050a18] border border-cyan-500/20">
                      <div className="text-[10px] text-amber-400 font-bold">2. ASTRA MONDE</div>
                      <p className="text-[11px] text-slate-300 mt-1">-40 GW Consommation</p>
                    </div>

                    <div className="p-2.5 rounded bg-[#050a18] border border-cyan-500/20">
                      <div className="text-[10px] text-emerald-400 font-bold">3. LOCAL ({colony.name})</div>
                      <p className="text-[11px] text-slate-300 mt-1">
                        +{colony.localProduction.food} Rations • +{colony.localProduction.minerals} Minéraux • +{colony.localProduction.energy} GW
                      </p>
                    </div>
                  </div>
                </div>

                {/* Infrastructure Buildings */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1.5">
                    Bâtiments et Cités Actives :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {colony.buildings.map((b) => (
                      <div key={b.id} className="p-2.5 rounded bg-[#060c1d] border border-slate-700/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-slate-200 font-semibold text-xs mb-1">
                            <span className="truncate">{b.name}</span>
                            <span className="text-[9px] px-1 rounded bg-slate-800 text-cyan-300">
                              NV {b.level}
                            </span>
                          </div>
                          <p className="text-[10px] text-emerald-400">{b.outputSummary}</p>
                        </div>
                        <button
                          onClick={() => upgradeColonyBuilding(colony.id, b.id)}
                          className="mt-2 text-[9px] text-cyan-300 hover:text-cyan-100 flex items-center gap-1 font-bold underline"
                        >
                          <Hammer className="w-3 h-3" /> Améliorer (+Production)
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* ================= TAB 4: CODEX & BASES DE DONNÉES ================= */}
        {activeTab === 'database' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Database Switcher Header */}
            <div className="p-3.5 rounded bg-[#091126] border border-amber-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300 uppercase tracking-wider">
                    ARCHIVES &amp; BASES DE DONNÉES DE L&apos;UNION (CATALOGUE COMPLET)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {(['buildings', 'biomes', 'factions', 'modules'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setDbCategory(cat)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase transition-colors ${
                        dbCategory === cat
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat === 'buildings' ? 'Bâtiments (20+)' : cat === 'biomes' ? 'Biomes (8)' : cat === 'factions' ? 'Factions (4)' : 'Modules ASTRA'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex items-center gap-2 bg-[#050a18] p-2 rounded border border-slate-800">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans la base de données..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-slate-200 focus:outline-hidden flex-1"
                />
              </div>
            </div>

            {/* DB Category 1: Planetary Buildings */}
            {dbCategory === 'buildings' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLANETARY_BUILDINGS_CATALOG.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.description.toLowerCase().includes(searchQuery.toLowerCase())).map((b) => (
                  <div key={b.id} className="p-3 rounded bg-[#060c1d] border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        {b.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-amber-300 border border-amber-500/20">
                        PALIER TIER {b.tier}
                      </span>
                    </div>

                    <p className="text-slate-400 text-[11px] leading-relaxed">{b.description}</p>
                    <p className="text-slate-500 text-[10px] italic">{b.lore}</p>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <div className="text-slate-300">
                        Coût : <strong className="text-cyan-300">{b.cost.minerals} Min</strong> | <strong className="text-amber-300">{b.cost.credits} ₢</strong>
                      </div>
                      <div className="text-emerald-400 font-bold">
                        {b.production.minerals ? `+${b.production.minerals} Min ` : ''}
                        {b.production.food ? `+${b.production.food} Rations ` : ''}
                        {b.production.energy ? `+${b.production.energy} GW ` : ''}
                        {b.production.researchPoints ? `+${b.production.researchPoints} R&D ` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DB Category 2: Planetary Biomes */}
            {dbCategory === 'biomes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PLANETARY_BIOMES_CATALOG.filter(bm => bm.name.toLowerCase().includes(searchQuery.toLowerCase())).map((bm) => (
                  <div key={bm.id} className="p-3 rounded bg-[#060c1d] border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs" style={{ color: bm.colorNeon }}>
                        {bm.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {bm.defaultDistrictSlots} Distr. Max
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{bm.description}</p>
                    <div className="text-[10px] text-slate-300 space-y-0.5">
                      <div>Habitabilité : <strong className="text-emerald-400">{bm.baseModifiers.habitabilityPercent}%</strong></div>
                      <div>Modificateurs : Nourriture x{bm.baseModifiers.foodMultiplier}, Minéraux x{bm.baseModifiers.mineralsMultiplier}, Énergie x{bm.baseModifiers.energyMultiplier}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DB Category 3: Interstellar Factions */}
            {dbCategory === 'factions' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INTERSTELLAR_FACTIONS_CATALOG.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map((fac) => (
                  <div key={fac.id} className="p-3 rounded bg-[#060c1d] border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs" style={{ color: fac.neonColor }}>
                        {fac.name}
                      </h4>
                      <span className="text-[9px] uppercase font-bold text-slate-400">{fac.archetype}</span>
                    </div>
                    <p className="text-[10px] text-cyan-300">Monde d&apos;origine : {fac.homeworld}</p>
                    <p className="text-slate-400 text-[11px]">{fac.lore}</p>
                    <div className="text-[10px] text-slate-300">
                      Marchandises : <strong className="text-amber-300">{fac.tradeGoods.join(', ')}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DB Category 4: ASTRA Modules */}
            {dbCategory === 'modules' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ASTRA_MODULES_CATALOG.map((mod) => (
                  <div key={mod.id} className="p-3 rounded bg-[#060c1d] border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-cyan-300">{mod.name}</h4>
                      <span className="text-[9px] px-1 rounded bg-slate-800 text-purple-300">TIER {mod.tier}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{mod.description}</p>
                    <div className="text-[10px] text-emerald-400 font-bold">Bonus : {mod.statBonus}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
